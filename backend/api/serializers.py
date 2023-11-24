from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password'] # if i want to do all use "__all__"

class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email','username', 'password'] # if i want to do all use "__all__"