from django.urls import path
from .views import recipes_view, favorites_view, folders_view, specific_folder, login_user, register_user, user_methods

urlpatterns = [
    path('login/', login_user, name='login'),
    path('signup/', register_user, name='signup'),
    path('user/', user_methods, name='users'),
    path('recipe/', recipes_view , name='recipes'),
    path('folder/', folders_view, name='folder'),
    path('folder/<str:folder_name>/', specific_folder, name='specific folder'),
    path('favorites/', favorites_view, name='favorites'),
]
