from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Favorites


class FavoritesInline(admin.StackedInline):  # Use TabularInline or StackedInline based on your preference
    model = Favorites
    extra = 0  # Number of empty forms to display


class CustomUserAdmin(UserAdmin):
    # Define the order of fields for the add and change forms
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'birthday')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    inlines = (FavoritesInline,)

# Register your CustomUser model with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Favorites)