from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password'] # if i want to do all use "__all__"

class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__" # if i want to do all use "__all__"