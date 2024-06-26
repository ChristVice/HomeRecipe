from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import NewUserSerializer, RecipeSerializer, FolderSerializer, FavoritesSerializer, MealDatesSerializer
from .models import CustomUser, Recipes, Folders, Favorites, MealDates


@api_view(['POST'])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        user = CustomUser.objects.get(username=username)

        # Authenticate the user with the provided password
        user = None
        try:
            user = authenticate(request, username=username, password=password)
        except:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_404_NOT_FOUND)

        if user is not None:
            login(request, user)

            try:
                token = Token.objects.get(user=user)
            except Token.DoesNotExist:
                token = Token.objects.create(user=user)

            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User with that username does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Invalid data provided :: {e}'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_methods(request):
    user = request.user

    if request.method == 'GET':
        if user and isinstance(user, CustomUser):
            return Response({'success': f'{user}'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            _user = user
            delete_user_instance = CustomUser.objects.filter(username=user).delete()
            return Response(
                {'success': f'deleted {_user}'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_user(request):
    try:
        serializer = NewUserSerializer(data=request.data, context={'request': request})

        if serializer.is_valid() is False:
            email = request.data['email']
            username = request.data['username']

            if CustomUser.objects.filter(email=email).exists() and CustomUser.objects.filter(username=username).exists():
                return Response('Email and Username already taken', status=status.HTTP_409_CONFLICT)
            elif CustomUser.objects.filter(email=email).exists():
                return Response('Email already taken', status=status.HTTP_409_CONFLICT)
            elif CustomUser.objects.filter(username=username).exists():
                return Response('Username already taken', status=status.HTTP_409_CONFLICT)

            elif request.data['username'] is None or request.data['email'] is None or request.data['password'] is None:
                return Response('Invalid data given', status=status.HTTP_400_BAD_REQUEST)

        elif serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            print(serializer.validated_data)
            # Check if a user with the same username already exists
            if CustomUser.objects.filter(username=username).exists():
                return Response('Username already taken', status=status.HTTP_409_CONFLICT)
            elif CustomUser.objects.filter(email=email).exists():
                return Response('Email already in use', status=status.HTTP_409_CONFLICT)

            # Create a new user
            new_user = CustomUser.objects.create_user(**serializer.validated_data)
                # You can add additional fields to the user model if needed
                # user.first_name = serializer.validated_data['first_name']
                # user.last_name = serializer.validated_data['last_name']
                # user.save()

            # Log in the newly created user
            login(request, new_user)

            try:
                token = Token.objects.get(user=new_user)
            except Token.DoesNotExist:
                token = Token.objects.create(user=new_user)

            message = f'User :: {username}, registered and logged in successfully'
            token, _ = Token.objects.get_or_create(user=new_user)

            return Response({'token': token.key, 'message': message}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': serializer.error_messages}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': f'Invalid data provided :: {e}'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsAuthenticated])
def specific_folder(request, folder_name):
    user = request.user

    if request.method == 'PUT':

        try:
            folder = Folders.objects.get(user=user, folder_name=folder_name)
            new_name = request.data['folderName']

            if Folders.objects.filter(user=user, folder_name=new_name).exists():
                return Response({'error': 'Folder name already exists'}, status=status.HTTP_409_CONFLICT)
            
            folder.folder_name = new_name
            folder.save()
            return Response({"success" : f"renamed folder {new_name}"}, status=status.HTTP_200_OK)

        except Folders.DoesNotExist:
            return Response({'error': f'Folder "{folder_name}" not found'}, status=status.HTTP_404_NOT_FOUND)


    elif request.method == 'GET':
        try:
            if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
                # gets the folder name 
                if folder_name:
                    if folder_name.upper() == "ALL": # getting all folders and their recipes
                        results = {}
                        folders_list = []
                        # get all the folders associated to the user
                        for folders in Folders.objects.filter(user=user):
                            folders_list.append(folders.folder_name)
                            # get recipe(s) from that folder
                            recipe_folders = folders.recipes 
                            # get its data add it to result
                            results[folders.folder_name] = RecipeSerializer(recipe_folders, many=True).data 

                        return Response({"folders" : folders_list, "results" : results }, status=status.HTTP_200_OK)
                    
                    else: # get just folder and its items
                        try:
                            Folders.objects.get(user=user, folder_name=folder_name)
                        except Folders.DoesNotExist:
                            return Response({'error': f'Folder "{folder_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

                        folder = Folders.objects.filter(user=user, folder_name=folder_name).first()
                        if folder:
                            # Retrieve all recipes associated with the specified folder
                            recipes = folder.recipes 
                            # get all data
                            serializer = RecipeSerializer(recipes, many=True)
                            return Response({"result" : {folder.folder_name : serializer.data}}, status=status.HTTP_200_OK)
                        else:
                            return Response({"message": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)

                return Response({'error' : 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        except Folders.DoesNotExist:
            return Response({"error": f"Favorite with folder name '{folder_name}' not found."},
                            status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
                return Response({'error' : f'Invalid data provided {e}'}, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == "POST":
        print('here')
        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            recipe_data = request.data  # Assuming recipe data is included
            recipeID = recipe_data['recipeID'] 

            # If 'recipe_label' is not in the recipe_data dictionary
            if 'recipe_label' not in recipe_data:
                # write code for cookbook to just send recipeID and nothing else
                try:

                    recipe = Recipes.objects.filter(recipeID=recipeID).first()

                    # check if recipe exists
                    if recipe is None:
                        return Response({"error": f"Recipe by ID not found."}, status=status.HTTP_404_NOT_FOUND)

                    # check if folder exists
                    if Folders.objects.filter(user=user, folder_name=folder_name).exists() is False:
                        return Response({"error": f"Folder '{folder_name}' not found."}, status=status.HTTP_404_NOT_FOUND)

                    # check if recipe already exists in folder
                    if Folders.objects.filter(user=user, folder_name=folder_name, recipes=recipe).exists():
                        return Response({'error': 'Recipe by ID is already in the folder'}, status=status.HTTP_409_CONFLICT)

                    folder = Folders.objects.filter(user=user, folder_name=folder_name).first()
                    # Add the recipe to the folder
                    folder.recipes.add(recipe)

                    # Serialize the updated folder and respond
                    folder_serializer = FolderSerializer(folder)
                    return Response(f"Successfully put recipe by ID into folder {folder_name}", status=status.HTTP_200_OK)
                    

                except Folders.DoesNotExist:
                    return Response({"error": f"Folder '{folder_name}' not found."}, status=status.HTTP_404_NOT_FOUND)
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                try:
                    # Check if the recipe with the given recipeID already exists, if not make one
                    recipe = None
                    if  Recipes.objects.filter(recipeID=recipeID).exists() is False:
                        # If it doesn't exist, create a new recipe
                        serializer = RecipeSerializer(data=recipe_data, context={'request': request})

                        if serializer.is_valid():
                            recipe_data = serializer.validated_data
                            recipe_data['user'] = user
                            recipe = Recipes.objects.create(**recipe_data)
                        else:
                            return Response({'Invalid recipe data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        recipe = Recipes.objects.filter(recipeID=recipeID).first()
                    
                    # check if folder exists
                    if Folders.objects.filter(user=user, folder_name=folder_name).exists() is False:
                        return Response({"error": f"Folder '{folder_name}' not found."}, status=status.HTTP_404_NOT_FOUND)

                    # check if recipe already exists in folder
                    if Folders.objects.filter(user=user, folder_name=folder_name, recipes=recipe).exists():
                        return Response({'error': 'Recipe is already in the folder'}, status=status.HTTP_409_CONFLICT)

                    folder = Folders.objects.filter(user=user, folder_name=folder_name).first()
                    # Add the recipe to the folder
                    folder.recipes.add(recipe)

                    # Serialize the updated folder and respond
                    folder_serializer = FolderSerializer(folder)
                    return Response({f"Successfully put recipe into folder {folder_name}"}, status=status.HTTP_200_OK)

                except Folders.DoesNotExist:
                    return Response({"error": f"Folder '{folder_name}' not found."}, status=status.HTTP_404_NOT_FOUND)
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'error' : 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def folders_view(request):
    user = request.user

    if request.method == "POST":
        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            # gets the folder name 
            folder_name = request.data['folder_name']
            if folder_name == "":
                return Response({'error': 'Folder name not provided'}, status=status.HTTP_404_NOT_FOUND)

            # check if folder already exists
            if Folders.objects.filter(user=user, folder_name=folder_name).exists():
                return Response({"error":f'Folder {folder_name} already exists for user ({user})'}, status=status.HTTP_409_CONFLICT)

            # create the folder if all else is good
            serializer = FolderSerializer(data=request.data, context={'request': request})
            if folder_name and serializer.is_valid():
                folder_instance = Folders.objects.create(user=user, folder_name=folder_name)
                return Response({"succesful":f'Folder {folder_name} created for user :: {user}'}, status=status.HTTP_200_OK)

            return Response({'error' : 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
                

    elif request.method == "DELETE":
        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            folder_name = request.data['folderName']
            try:
                Folders.objects.get(user=user, folder_name=folder_name)
            except Folders.DoesNotExist:
                return Response({'error': f'Folder "{folder_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

            folder = Folders.objects.filter(user=user,folder_name=folder_name).first()
            if folder:
                # delete folder
                folder.delete()
                return Response({"success" : f"Succesfully deleted {folder_name}"}, status=status.HTTP_200_OK)

            return Response({'error' : 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def recipes_view(request):
    user = request.user

    if request.method == 'GET':
        if request and user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            user_recipe = Recipes.objects.filter(users=user)

            serializer = RecipeSerializer(user_recipe, many=True)

            return Response({'recipes': serializer.data}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == 'POST':
        if request and user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            # create serializer of recipe, validate it, if good set the variables
            serializer = RecipeSerializer(data=request.data, context={'request': request})

            if serializer.is_valid():
                recipe_data = serializer.validated_data

                if Recipes.objects.filter(recipeID=recipe_data['recipeID']).exists():
                    return Response('Recipe already exists in database' , status=status.HTTP_409_CONFLICT)

                # if recipeID not exist within same folder, add it 
                recipe_instance = Recipes.objects.create(**recipe_data)
                recipe_instance.users.set([user])

                return Response({'message': 'successfully added recipe'}, status=status.HTTP_201_CREATED)

            return Response({'Invalid data provided' : f'{serializer.errors}'}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if request and user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            recipeID = request.data['recipeID']
            recipe = Recipes.objects.filter(recipeID=recipeID).first()

            if recipe:
                print(recipe.users.all())
                recipe.users.remove(user)
                recipe.save()
                print(recipe.users.all())
                return Response(f'successful deleted {user} from recipe', status=status.HTTP_200_OK)
            
            return Response({'recipe not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def favorites_view(request):
    user = request.user

    def get_recipe_by_recipeID(recipeID):
        return Recipes.objects.filter(recipeID=recipeID).first() 

    if request.method == 'GET':
        # Retrieve all favorites for the current user
        favorites = Favorites.objects.filter(user=user)
        serializer = FavoritesSerializer(favorites, many=True)

        results  = []

        if serializer.data and serializer.data:
            for recipe_key in serializer.data:
                for key in recipe_key['recipes']:
                    recipe = Recipes.objects.get(pk=key) 
                    recipe_serial = RecipeSerializer(recipe).data
                    results.append(recipe_serial)

        return Response({"Favorites" : results}, status=status.HTTP_200_OK)


    elif request.method == 'POST':
        # Extract data from the request
        try:
            recipe_data = request.data  # Assuming recipe data is included

            # Check if the recipe with the given recipeID already exists
            recipe = get_recipe_by_recipeID(recipe_data.get('recipeID'))

            if not recipe:
                # If it doesn't exist, create a new recipe
                serializer = RecipeSerializer(data=recipe_data, context={'request': request})

                if serializer.is_valid():
                    recipe_data = serializer.validated_data
                    recipe = Recipes.objects.create(**recipe_data)
                    recipe.users.add(user)
                    recipe.save()
                else:
                    return Response({'Invalid recipe data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


            # if user has a favorite table already
            if Favorites.objects.filter(user=user).exists():
                favorite = Favorites.objects.filter(user=user).first()
                favorite.recipes.add(recipe)    
                favorite.save()
                return Response({"Favorite post successful"}, status=status.HTTP_201_CREATED)

            #if user doesnt have favorite table already 
            favorite = Favorites.objects.create(user=user)
            favorite.recipes.add(recipe)
            favorite.save()
            return Response({"Favorite created and posted recipe"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == 'DELETE':
        # Remove a favorite for the current user
        try:
            recipeID = request.data['recipeID']
            recipe = get_recipe_by_recipeID(recipeID)
            favorite = Favorites.objects.get(user=user)
            favorite.recipes.remove(recipe)
            favorite.save()
            return Response({"message": "Favorite deleted successfully"}, status=status.HTTP_200_OK)
        except Favorites.DoesNotExist:
            return Response({"error": "Favorite not found"}, status=status.HTTP_404_NOT_FOUND)
        except Favorites.MultipleObjectsReturned:
            return Response({"error": "Multiple favorite recipes found"}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            print(e)
            return Response({"error": f"Error :: {e}"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def meal_dates_view(request):
    user = request.user

    from pprint import pprint
    if request.method == 'GET':
        # Retrieve all meal dates for the current user
        meal_dates = MealDates.objects.filter(user=user)
        serializer = MealDatesSerializer(meal_dates, many=True)

        response_data = {}
        for meal_date in serializer.data:
            date = meal_date['date']

            recipes_with_event_id = []
            for recipe_id in meal_date['recipes']:
                recipe = Recipes.objects.get(pk=recipe_id)
                recipe_serial = RecipeSerializer(recipe).data
                recipe_serial['eventID'] = meal_date['eventID']
                recipes_with_event_id.append(recipe_serial)
                # recipes_with_event_id.append(recipe_id)

            if date in response_data:
                response_data[date].extend(recipes_with_event_id)
            else:
                response_data[date] = recipes_with_event_id

        final_response = [{'date': date, 'recipes': recipes} for date, recipes in response_data.items()]

        return Response(final_response, status=status.HTTP_200_OK)


    if request.method == 'POST':
        try:
            date = request.data.get('date')
            recipeID = request.data.get('recipeID')
            eventID = request.data.get('eventID')

            if MealDates.objects.filter(user=user, eventID=eventID).exists(): 
                recipe = Recipes.objects.get(users=user, recipeID=recipeID)

                meal_date = MealDates.objects.filter(user=user, eventID=eventID).first()
                meal_date.recipes.clear()
                meal_date.recipes.add(recipe) 
                meal_date.date = date
                meal_date.save()

            else:
                serializer = MealDatesSerializer(data=request.data, context={'request': request})
                if serializer.is_valid() and date and recipeID and eventID:
                    recipe = Recipes.objects.get(users=user, recipeID=recipeID)

                    meal_date = MealDates.objects.filter(user=user, eventID=eventID)
                    if meal_date.exists():
                        meal_date = meal_date.first()
                        meal_date.recipes.add(recipe)
                        meal_date.save()    
                    else:
                        meal_date = MealDates.objects.create(user=user, date=date, eventID=eventID)
                        meal_date.recipes.set([recipe])
                        meal_date.save()    

            return Response({"Meal date posted successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Invalid data provided :: {e}"}, status=status.HTTP_400_BAD_REQUEST)


    if request.method == 'DELETE':
        try:
            eventID = request.data.get('eventID')

            if MealDates.objects.filter(user=user, eventID=eventID).exists(): 
                meal_date = MealDates.objects.filter(user=user, eventID=eventID).first()
                meal_date.delete()

                return Response({"Meal date deleted successfully"}, status=status.HTTP_201_CREATED)

            return Response({"Meal date not found"}, status=status.HTTP_409_CONFLICT)

        except Exception as e:
            return Response({"error": f"Invalid data provided :: {e}"}, status=status.HTTP_400_BAD_REQUEST)
