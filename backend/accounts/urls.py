from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, MyTokenObtainPairView, LogoutView

urlpatterns = [
    path('register', RegisterView.as_view(), name='auth_register'),
    path('login', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout', LogoutView.as_view(), name='auth_logout'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
