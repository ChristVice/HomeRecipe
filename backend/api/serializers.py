from rest_framework import serializers
from .models import CustomUser, Recipes, Folders, Favorites

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password'] # if i want to do all use "__all__"

class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email','username', 'password'] # if i want to do all use "__all__"

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipes
        fields = ['recipeID', 'calories', 'recipe_label', 'cuisine_type', 'meal_type',
                  'time_in_minutes', 'ingredient_lines', 'website_url', 'image_url', ]  # Specify the fields you want to include


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folders
        fields = ['folder_name']  # Specify the fields you want to include

class FavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorites
        fields = ['recipe']  # Specify the fields you want to include