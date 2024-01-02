from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, NewUserSerializer, FavoritesSerializer
from .models import CustomUser, Favorites

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes


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
            serializer = NewUserSerializer(data=request.data)
            
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



class FavoritesView(APIView):

    def get(self, request):
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
                user_favorites = Favorites.objects.filter(user=user)

                if user_favorites:
                    return Response({'recipes': user_favorites.values()}, status=status.HTTP_200_OK)

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
                user_favorite = Favorites.objects.filter(user=user, image_url=image).first()

                if user_favorite:
                    user_favorite.delete()
                    return Response({'message': f'successful deleted recipe'}, status=status.HTTP_200_OK)
                
                return Response({'message': f'favorite not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        user = None
        user_token = request.headers.get('Authorization')

        if user_token:
            try:
                token = Token.objects.get(key=user_token)
                user = token.user
            except Token.DoesNotExist:
                pass

        serializer = FavoritesSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
                favorites_data = serializer.validated_data
                favorites_data['user'] = user  # Assign user to the data before saving

                # Create the favorites instance explicitly
                if Favorites.objects.filter(image_url=serializer.validated_data['image_url']).exists() is False:
                    favorites_instance = Favorites.objects.create(**favorites_data)

                return Response({'message': 'successfully added favorite'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        