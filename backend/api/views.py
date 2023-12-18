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


class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User with that username does not exist'}, status=status.HTTP_404_NOT_FOUND)

        # Authenticate the user with the provided password
        user = authenticate(request, username=username, password=password)
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
            #return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


class NewUserLoginView(APIView):
    def post(self, request):
        serializer = NewUserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            # Check if a user with the same username already exists
            if CustomUser.objects.filter(username=username).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
            elif CustomUser.objects.filter(email=email).exists():
                return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new user
            user = CustomUser.objects.create_user(username=username, password=password, email=email)
                # You can add additional fields to the user model if needed
                # user.first_name = serializer.validated_data['first_name']
                # user.last_name = serializer.validated_data['last_name']
                # user.save()
            message = f'User :: {username}, registered successfully'
            return Response({'message': message}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoritesView(APIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]

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
        print(f"User token :: {user_token}\n")
        print(f"User :: {user}\n")
        print(serializer.is_valid())

        if serializer.is_valid():
            if user and isinstance(user, CustomUser):  # Ensure user is a CustomUser instance
                favorites_data = serializer.validated_data
                favorites_data['user'] = user  # Assign user to the data before saving

                # Create the favorites instance explicitly
                favorites_instance = Favorites.objects.create(**favorites_data)

                return Response({'message': 'successful favorite'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
