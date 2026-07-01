from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Format response data
        user_data = UserSerializer(user, context=self.get_serializer_context()).data
        return Response({
            "message": "User registered successfully.",
            "user": user_data
        }, status=status.HTTP_201_CREATED)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = (permissions.AllowAny,)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # In simple token setups, frontend just discards the token.
        # If using simplejwt token blacklist, we can blacklist the refresh token here.
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                # If blacklist is available, we can import and blacklist:
                from rest_framework_simplejwt.tokens import RefreshToken
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"message": "Logout successful (token blacklisted)."}, status=status.HTTP_200_OK)
        except Exception:
            pass
        return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
