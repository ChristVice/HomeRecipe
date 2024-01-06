from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, NewUserSerializer, RecipeSerializer, FolderSerializer
from .models import CustomUser, Recipe, Folder


class UserAuthenticationView(APIView):
    def post(self, request):
        if request.data.get('email') is None: # if there is no email found, means we are loggin in someone
            username = request.data.get('username')
            password = request.data.get('password')

            try:
                user = CustomUser.objects.get(username=username)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User with that username does not exist'}, status=status.HTTP_404_NOT_FOUND)

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

                '''
                    To include an authentication token in the response was given as an example to 
                    demonstrate how to include additional data in the response when the 
                    login is successful. The inclusion of an authentication token in the response can be useful for scenarios 
                    where token-based authentication is implemented, allowing the frontend to store the token and use it for 
                    subsequent authenticated requests.

                    token, _ = Token.objects.get_or_create(user=user)
                    return Response({'token': token.key}, status=status.HTTP_200_OK)

                    token, _ = Token.objects.get_or_create(user=user)
                    return Response({'token': token.key}, status=status.HTTP_200_OK)
                    # return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
            
                '''

                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


        else : # if we are signing a user up, we make new User and log him into the system
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

                # create a default folder named Likes (will hold all the likes of the user)
                default_likes_folder = Folder.objects.create(user=new_user, folder_name='Likes')

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

            
        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user = None
        user_token = request.headers.get('Authorization')

        if user_token:
            try:
                token = Token.objects.get(key=user_token)
                user = token.user
            except Token.DoesNotExist:
                pass

            if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
                return Response(
                    {'success': f'{user}'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = None
        user_token = request.headers.get('Authorization')

        if user_token:
            try:
                token = Token.objects.get(key=user_token)
                user = token.user
            except Token.DoesNotExist:
                pass

            if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
                _user = user
                delete_user_instance = CustomUser.objects.filter(username=user).delete()
                return Response(
                    {'success': f'deleted {_user}'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)



class RecipeView(APIView):
    def get(self, request):
        # will need to redo, extract from specific folder or ALL folders
        if request:
            user = None
            user_token = request.headers.get('Authorization')

            if user_token:
                try:
                    token = Token.objects.get(key=user_token)
                    user = token.user
                except Token.DoesNotExist:
                    pass

            if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
                user_recipe = Recipe.objects.filter(user=user)

                serializer = RecipeSerializer(user_recipe, many=True)

                # get all the recipes data and loop through the list
                for recipe in serializer.data:
                    # replace the folder id with the actual name
                    folder_id = recipe["folder"] 
                    recipe["folder"] = Folder.objects.get(pk=folder_id).folder_name

                return Response({'recipes': serializer.data}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if request:
            user = None
            user_token = request.headers.get('Authorization')

            if user_token:
                try:
                    token = Token.objects.get(key=user_token)
                    user = token.user
                except Token.DoesNotExist:
                    pass

            if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
                image = request.data['imageURL']
                from_folder = request.data['fromFolder']
                folder = Folder.objects.get(user=user, folder_name=from_folder).pk
                recipe = Recipe.objects.filter(user=user, image_url=image, folder=folder).first()

                if recipe:
                    recipe.delete()
                    return Response({'message': f'successful deleted Recipe'}, status=status.HTTP_200_OK)
                
                return Response({'message': f'recipe not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        user = None
        user_token = request.headers.get('Authorization')

        # finds the user from Token, return error if not found
        if user_token:
            try:
                token = Token.objects.get(key=user_token)
                user = token.user
            except Token.DoesNotExist:
                pass

        if user and isinstance(user, CustomUser) is False:  # Ensure user is a CustomUser instance
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        # Find the folder and assign it, return error if not found
        folder_name = request.data.get('folder')
        try:
            find_folder = Folder.objects.get(user=user, folder_name=folder_name)
        except Folder.DoesNotExist:
            return Response({'error': f'Folder "{folder_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

        request.data['folder'] = find_folder.pk # resets the folder var to the primary key of model

        # create serializer of recipe, validate it, if good set the variables
        serializer = RecipeSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
                recipe_data = serializer.validated_data
                recipe_data['user'] = user  # Assign user to the data 
                recipe_data['folder'] = find_folder  # Assign folder to the data

                # if image url not exist within same folder, add it 
                if Recipe.objects.filter(user=user, folder=recipe_data['folder'], image_url=recipe_data['image_url']).exists() is False:
                    recipe_instance = Recipe.objects.create(**recipe_data)

                return Response({'message': 'successfully added recipe to folder'}, status=status.HTTP_201_CREATED)

        return Response({'Invalid data provided' : f'{serializer.errors}'}, status=status.HTTP_400_BAD_REQUEST)
        


class FoldersView(APIView):
    def get(self, request, folder_name, format=None):
        # gets the user
        user = None
        user_token = request.headers.get('Authorization')

        if user_token:
            try:
                token = Token.objects.get(key=user_token)
                user = token.user
            except Token.DoesNotExist:
                pass

        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            # gets the folder name 
            
            if folder_name:
                if folder_name.upper() == "ALL": # getting all folders and their recipes
                    results = {}
                    # get all the folders associated to the user
                    for folders in CustomUser.objects.get(username=user).folders.all():
                        # get recipe(s) from that folder
                        recipe_folders = Recipe.objects.filter(folder=folders)
                        # get its data add it to result
                        results[folders.folder_name] = RecipeSerializer(recipe_folders, many=True).data 

                    return Response({"results" : results}, status=status.HTTP_200_OK)
                
                else: # get just folder and its items
                    try:
                        Folder.objects.get(user=user, folder_name=folder_name)
                    except Folder.DoesNotExist:
                        return Response({'error': f'Folder "{folder_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

                    folder = Folder.objects.filter(folder_name=folder_name, user=user).first()
                    if folder:
                        # Retrieve all recipes associated with the specified folder
                        recipes = Recipe.objects.filter(folder=folder)
                        # get all data
                        serializer = RecipeSerializer(recipes, many=True)
                        return Response({"result" : {folder.folder_name : serializer.data}}, status=status.HTTP_200_OK)
                    else:
                        return Response({"message": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response({'error' : 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


    def post(self, request):
        user = None
        user_token = request.headers.get('Authorization')

        if user_token:
            try:
                token = Token.objects.get(key=user_token)
                user = token.user
            except Token.DoesNotExist:
                pass

        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            # gets the folder name 
            folder_name = request.data['folder_name']
            if folder_name == "":
                return Response({'error': 'Folder name not provided'}, status=status.HTTP_404_NOT_FOUND)

            # check if folder already exists
            existing_folders = Folder.objects.filter(user=user, folder_name=folder_name)
            if len (existing_folders) > 0:
                return Response({"error":f'Folder {folder_name} already exists for user ({user})'}, status=status.HTTP_409_CONFLICT)

            # create the folder if all else is good
            serializer = FolderSerializer(data=request.data, context={'request': request})
            if folder_name and serializer.is_valid():
                folder_instance = Folder.objects.create(user=user, folder_name=folder_name)
                return Response({"succesful":f'Folder {folder_name} created for user :: {user}'}, status=status.HTTP_200_OK)

            return Response({'error' : 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    

    def put(self, request):
        user = None
        user_token = request.headers.get('Authorization')

        if user_token:
            try:
                token = Token.objects.get(key=user_token)
                user = token.user
            except Token.DoesNotExist:
                pass

        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            # gets the folder name 
            folder_name = request.data['folder_name']
            try:
                Folder.objects.get(user=user, folder_name=folder_name)
            except Folder.DoesNotExist:
                return Response({'error': f'Folder "{folder_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

            new_name = request.data['new_folder_name']
            if new_name == "":
                return Response({'error': 'New name not provided'}, status=status.HTTP_404_NOT_FOUND)

            # check if new name folder already exists
            existing_folders = Folder.objects.filter(user=user, folder_name=new_name)
            if len(existing_folders) > 0:
                return Response({"error":f'Folder {new_name} already exists for user :: {user}'}, status=status.HTTP_409_CONFLICT)


            folder = Folder.objects.filter(user=user, folder_name=folder_name).first()
            if folder:
                # rename folder
                folder.folder_name = new_name
                folder.save()
                return Response({"success" : f"Succesfully renamed {folder_name} to {new_name}"}, status=status.HTTP_200_OK)

            return Response({'error' : 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


    def delete(self, request):
        user = None
        user_token = request.headers.get('Authorization')

        if user_token:
            try:
                token = Token.objects.get(key=user_token)
                user = token.user
            except Token.DoesNotExist:
                pass

        if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
            folder_name = request.data['folder_name']
            try:
                Folder.objects.get(user=user, folder_name=folder_name)
            except Folder.DoesNotExist:
                return Response({'error': f'Folder "{folder_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

            folder = Folder.objects.filter(folder_name=folder_name, user=user).first()
            if folder:
                # delete folder
                folder.delete()
                return Response({"success" : f"Succesfully deleted {folder_name}"}, status=status.HTTP_200_OK)

            return Response({'error' : 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


