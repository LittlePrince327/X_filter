
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework import permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from login.models import CustomUser  # 여기에는 사용자 모델을 넣어야 합니다


class UserSignup(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            profile_picture = request.data.get('profile_picture', None)
            if profile_picture:
                user.profile_picture = profile_picture
                user.save()

            token = self.create_tokens(user)
            return Response(token, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def create_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        token = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return token

class UserLogin(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # 인증 토큰을 얻기 위해 TokenObtainPairSerializer 사용
        token_serializer = TokenObtainPairSerializer(data=request.data)
        token_serializer.is_valid(raise_exception=True)
        tokens = token_serializer.validated_data

        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user_id': user.id,
            'username': user.username,
        }, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    def create_tokens(self, user):
        response_data = super().create_tokens(user)
        username = self.request.data.get('username')
        user_data = get_user_model().objects.get(username=username)
        response_data['email'] = user_data.email
        return response_data

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.data = self.create_tokens(self.user)
        return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user_id = request.user.id  # 인증된 사용자의 ID 가져오기
    try:
        user = CustomUser.objects.get(id=user_id)  # 해당 ID를 가진 사용자 레코드를 DB에서 가져옴
        # 사용자 정보를 시리얼라이즈하기 위한 작업(예시)
        serialized_user = {
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            # 다른 필드들을 추가할 수 있음
        }
        return Response(serialized_user)
    except CustomUser.DoesNotExist:
        return Response({'error': '사용자를 찾을 수 없습니다.'}, status=404)