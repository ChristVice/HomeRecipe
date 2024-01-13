from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    birthday = models.DateField(null=True, blank=True)  # Add the birthday field

    def __str__(self):
        return self.username

class Recipes(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    recipe_label = models.CharField(max_length=255)
    calories = models.DecimalField(max_digits=10, decimal_places=2) 
    cuisine_type = models.CharField(max_length=100, default=None)
    meal_type = models.CharField(max_length=100, default=None)
    time_in_minutes = models.IntegerField(null=True, default=0)
    ingredient_lines = models.TextField(null=True, default=None)  # Consider using ArrayField if using PostgreSQL
    website_url = models.URLField(default='https://google.com', max_length=2000)
    image_url = models.URLField(default='https://example.com/default_image.jpg', max_length=2000)

    class Meta:
        verbose_name_plural = "Recipes"

    def __str__(self):
        return self.recipe_label

class Favorites(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='favorites')
    recipe = models.ForeignKey(Recipes, on_delete=models.CASCADE, related_name='liked_by')

    class Meta:
        verbose_name_plural = "Favorites"

    def __str__(self):
        return f"{self.user.username}'s Favorites"

class Folders(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='folders')
    folder_name = models.CharField(max_length=255)
    recipes = models.ManyToManyField(Recipes, related_name='folders')

    class Meta:
        verbose_name_plural = "Folders"

    def __str__(self):
        return self.folder_name