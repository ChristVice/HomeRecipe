from django.urls import path
from .views import UserAuthenticationView, RecipeView, FoldersView 

urlpatterns = [
    path('login/', UserAuthenticationView.as_view(), name='login'),
    path('signup/', UserAuthenticationView.as_view(), name='signup'),
    path('recipe/', RecipeView.as_view(), name='recipes'),
    path('folder/', FoldersView.as_view(), name='folder'),
    path('folder/<str:folder_name>/', FoldersView.as_view(), name='folder'),
]
