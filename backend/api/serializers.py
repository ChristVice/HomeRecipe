from rest_framework import serializers
from .models import CustomUser, Favorites

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password'] # if i want to do all use "__all__"

class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email','username', 'password'] # if i want to do all use "__all__"

class FavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorites
        fields = ['calories', 'recipe_label', 'cuisine_type', 'meal_type',
                  'time_in_minutes', 'ingredient_lines', 'website_url', 'image_url', ]  # Specify the fields you want to include
