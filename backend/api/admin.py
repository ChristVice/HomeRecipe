from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Recipe, Folder
from .forms import RecipeAdminForm


class FolderInline(admin.TabularInline):
    model = Folder
    extra = 0

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    form = RecipeAdminForm
    # Rest of your admin configuration

class RecipeInline(admin.StackedInline):
    model = Recipe
    extra = 0

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "folder":
            # Get the currently selected user
            user_id = request.resolver_match.kwargs.get('object_id')
            if user_id:
                kwargs["queryset"] = CustomUser.objects.get(pk=user_id).folders.all()
            else:
                kwargs["queryset"] = kwargs.get("queryset").none()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class CustomUserAdmin(UserAdmin):
    # Define the order of fields for the add and change forms
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'birthday')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    inlines = [FolderInline, RecipeInline]

# Register your CustomUser model with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Folder)