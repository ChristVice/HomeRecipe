from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    birthday = models.DateField(null=True, blank=True)  # Add the birthday field

class Favorites(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='favorites')
    recipe_label = models.CharField(max_length=255)
    calories = models.DecimalField(max_digits=10, decimal_places=2) 
    
    class Meta:
        verbose_name_plural = "Favorites"  # Set the desired plural name explicitly



    '''
    image_url = models.URLField()
    category = models.CharField(max_length=100)
    website_url = models.URLField()
    ingredient_lines = models.TextField()  # Consider using ArrayField if using PostgreSQL
    summary = models.TextField()
    cuisine_type = models.CharField(max_length=100)
    time_in_minutes = models.IntegerField()
    
    '''