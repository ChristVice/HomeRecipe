from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Recipes, Folders, Favorites


class FolderInline(admin.TabularInline):
    model = Folders
    extra = 0

class FavoriteInline(admin.TabularInline):
    model = Favorites
    extra = 0

class RecipeInline(admin.StackedInline):
    model = Recipes
    extra = 0

class CustomUserAdmin(UserAdmin):
    # Define the order of fields for the add and change forms
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'birthday')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    inlines = [FolderInline, FavoriteInline, RecipeInline]

# Register your CustomUser model with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Recipes)
admin.site.register(Folders)