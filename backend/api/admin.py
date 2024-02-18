from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Recipes, Folders, Favorites, MealDates

class FolderInline(admin.TabularInline):
    model = Folders
    extra = 0

class FavoritesInline(admin.TabularInline):  # Use StackedInline for a different display style
    model = Favorites
    extra = 1  # Number of empty forms to display

class RecipesInline(admin.TabularInline):
    model = Recipes
    extra = 1

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(users__id=request.user.id)  # Filter based on current user

class MealDatesInline(admin.TabularInline):  # Use StackedInline for a different display style
    model = MealDates
    extra = 1  # Number of empty forms to display


class CustomUserAdmin(UserAdmin):

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('recipes')  # Prefetch recipes for efficiency


    # Define the order of fields for the add and change forms
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'birthday')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    inlines = [MealDatesInline, FolderInline, FavoritesInline, ]  # Include RecipesInline here


# Register your CustomUser model with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Recipes)
admin.site.register(Folders)
admin.site.register(Favorites)
admin.site.register(MealDates)
