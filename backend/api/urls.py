from django.urls import path
from .views import UserAuthenticationView, FavoritesView 

urlpatterns = [
    path('login/', UserAuthenticationView.as_view(), name='login'),
    path('signup/', UserAuthenticationView.as_view(), name='signup'),
    path('favorites/', FavoritesView.as_view(), name='favorites'),
]
