from django.urls import path
from .views import UserLoginView, NewUserLoginView, FavoritesView

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('signup/', NewUserLoginView.as_view(), name='signup'),
    path('favorites/', FavoritesView.as_view(), name='favorites'),
]
