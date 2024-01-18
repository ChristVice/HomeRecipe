from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .serializers import UserSerializer, NewUserSerializer, RecipeSerializer, FolderSerializer, FavoritesSerializer
from .models import CustomUser, Recipes, Folders, Favorites

import re


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
        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            # Check if a user with the same username already exists
            if CustomUser.objects.filter(username=username).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_409_CONFLICT)
            elif CustomUser.objects.filter(email=email).exists():
                return Response({'error': 'Email already in use'}, status=status.HTTP_409_CONFLICT)

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


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def specific_folder(request, folder_name):
    user = request.user

    if request.method == 'GET':
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
            return Response({"detail": f"Favorite with folder name '{folder_name}' not found."},
                            status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
                return Response({'error' : f'Invalid data provided {e}'}, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == "PUT":
        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            recipe_data = request.data  # Assuming recipe data is included
            recipeID = recipe_data['recipeID'] 

            try:
                # Check if the recipe with the given recipeID already exists, if not make one
                recipe = None
                if  Recipes.objects.filter(user=user, recipeID=recipeID).exists() is False:
                    # If it doesn't exist, create a new recipe
                    serializer = RecipeSerializer(data=recipe_data, context={'request': request})

                    if serializer.is_valid():
                        recipe_data = serializer.validated_data
                        recipe_data['user'] = user
                        recipe = Recipes.objects.create(**recipe_data)
                    else:
                        return Response({'Invalid recipe data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    recipe = Recipes.objects.filter(user=user, recipeID=recipeID).first()
                
                # check if folder exists
                if Folders.objects.filter(user=user, folder_name=folder_name).exists() is False:
                    return Response({"detail": f"Folder '{folder_name}' not found."}, status=status.HTTP_404_NOT_FOUND)

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
                return Response({"detail": f"Folder '{folder_name}' not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            user_recipe = Recipes.objects.filter(user=user)

            serializer = RecipeSerializer(user_recipe, many=True)

            return Response({'recipes': serializer.data}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == 'POST':
        if request and user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            # create serializer of recipe, validate it, if good set the variables
            serializer = RecipeSerializer(data=request.data, context={'request': request})

            if serializer.is_valid():
                recipe_data = serializer.validated_data
                recipe_data['user'] = user  # Assign user to the data 

                # if recipeID not exist within same folder, add it 
                if Recipes.objects.filter(user=user, recipeID=recipe_data['recipeID']).exists() is False:
                    recipe_instance = Recipes.objects.create(**recipe_data)

                return Response({'message': 'successfully added recipe'}, status=status.HTTP_201_CREATED)

            return Response({'Invalid data provided' : f'{serializer.errors}'}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if request and user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            recipeID = request.data['recipeID']
            recipe = Recipes.objects.filter(user=user, recipeID=recipeID).first()

            if recipe:
                recipe.delete()
                return Response({'successful deleted Recipe'}, status=status.HTTP_200_OK)
            
            return Response({'recipe not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def favorites_view(request):
    user = request.user

    def get_recipe_by_recipeID(recipeID):
        return Recipes.objects.filter(user=user, recipeID=recipeID).first() 


    if request.method == 'GET':
        # Retrieve all favorites for the current user
        favorites = Favorites.objects.filter(user=user)
        serializer = FavoritesSerializer(favorites, many=True)

        results  = []
        for i in serializer.data:
            recipe = Recipes.objects.get(pk=i['recipe']) 
            recipe_serial = RecipeSerializer(recipe).data
            results.append(recipe_serial)

        return Response({"Favorites" : results}, status=status.HTTP_200_OK)



    elif request.method == 'POST':
        if request:
            # Extract data from the request
            recipe_data = request.data  # Assuming recipe data is included

            # Check if the recipe with the given recipeID already exists
            recipe = get_recipe_by_recipeID(recipe_data['recipeID'])

            if recipe == None:
                # If it doesn't exist, create a new recipe
                serializer = RecipeSerializer(data=recipe_data, context={'request': request})

                if serializer.is_valid():
                    recipe_data = serializer.validated_data
                    recipe_data['user'] = user
                    recipe = Recipes.objects.create(**recipe_data)
                else:
                    return Response({'Invalid recipe data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the favorite already exists
            if Favorites.objects.filter(user=user, recipe=recipe).exists():
                return Response({"Favorite already posted for this recipe"}, status=status.HTTP_409_CONFLICT)

            # Create a new favorite
            favorite = Favorites.objects.create(user=user, recipe=recipe)
            return Response({"Favorite post successful"}, status=status.HTTP_201_CREATED)

        return Response({"error":"Invalid data provided"}, status=status.HTTP_400_BAD_REQUEST)


    elif request.method == 'DELETE':
        # Remove a favorite for the current user
        try:
            recipeID = request.data['recipeID']
            recipe_pk = get_recipe_by_recipeID(recipeID)
            favorite = Favorites.objects.get(user=user, recipe=recipe_pk.pk)
            favorite.delete()
            recipe_pk.delete()
            return Response({"message": "Favorite deleted successfully"}, status=status.HTTP_200_OK)
        except Favorites.DoesNotExist:
            return Response({"error": "Favorite not found"}, status=status.HTTP_404_NOT_FOUND)
        except Favorites.MultipleObjectsReturned:
            return Response({"error": "Multiple favorite recipes found"}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            print(e)
            return Response({"error": f"Error :: {e}"}, status=status.HTTP_400_BAD_REQUEST)
