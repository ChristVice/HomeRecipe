from django.urls import path
from .views import *

urlpatterns = [
    path('login/', login_user, name='login'),
    path('signup/', register_user, name='signup'),
    path('user/', user_methods, name='users'),
    path('recipe/', recipes_view , name='recipes'),
    path('folder/', folders_view, name='folder'),
    path('folder/<str:folder_name>/', specific_folder, name='specific folder'),
    path('favorites/', favorites_view, name='favorites'),
    path('mealdates/', meal_dates_view, name='meal dates'),
]
