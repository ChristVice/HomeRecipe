from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, NewUserSerializer
from .models import User

class UserLoginView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                '''
                To include an authentication token in the response was given as an example to 
                demonstrate how to include additional data in the response when the 
                login is successful. The inclusion of an authentication token in the response can be useful for scenarios 
                where token-based authentication is implemented, allowing the frontend to store the token and use it for 
                subsequent authenticated requests.

                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
                '''
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
                # return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewUserLoginView(APIView):
    def post(self, request):
        serializer = NewUserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            print(User.objects.all())
            # Check if a user with the same username already exists
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new user
            user = User.objects.create_user(username=username, password=password, email=email)
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    '''
    def post(self, request):
        serializer = NewUserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            # Check if a user with the same username already exists
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a new user
            print("something :: ",username, password, email)
            print("something :: ", User.objects.all())
            user = User.objects.create_user(username=username, password=password, email=email)
                # You can add additional fields to the user model if needed
                # user.first_name = serializer.validated_data['first_name']
                # user.last_name = serializer.validated_data['last_name']
                # user.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    '''
