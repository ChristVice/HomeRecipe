from django.urls import path
from .views import UserLoginView, NewUserLoginView

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('signup/', NewUserLoginView.as_view(), name='signup'),
]
