from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class CustomUser(AbstractUser):
    birthday = models.DateField(null=True, blank=True)  # Add the birthday field

