from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import permissions

class UserSignup(APIView):
    permission_classes = [permissions.AllowAny]

    def create_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return token

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = self.create_tokens(user)
            return Response(token, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(ObtainAuthToken):
    def create_tokens(self, user):
        token, created = Token.objects.get_or_create(user=user)
        return {
            'token': token.key,
            'username': user.username
        }

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token_data = self.create_tokens(user)
            return Response(token_data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    def create_tokens(self, user):
        response_data = super().create_tokens(user)
        email = self.request.data.get('email')
        user_data = get_user_model().objects.get(email=email)
        response_data['email'] = user_data.email
        return response_data

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            response.data = self.create_tokens(self.user)
        
        return response
