import json
from login.models import CustomUser
from .serializers import UserSerializer, FollowUserSerializer
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework import status, permissions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

# 회원가입 API View
class UserSignup(APIView):
    # 모든 사용자에게 접근을 허용
    permission_classes = [permissions.AllowAny]
    # POST 요청을 처리하는 메서드
    def post(self, request):
        # 사용자 정보를 직렬화
        serializer = UserSerializer(data=request.data)
        # 직렬화가 유효하다면 사용자를 저장
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 직렬화가 유효하지 않다면 에러 메시지를 응답
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 사용자 로그인 처리
class UserLogin(ObtainAuthToken):
    # POST 요청을 처리하는 메서드
    def post(self, request, *args, **kwargs):
        # 토큰 시리얼라이저를 이용하여 사용자 정보와 토큰 획득
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # TokenObtainPairSerializer를 사용하여 토큰 획득
        token_serializer = TokenObtainPairSerializer(data=request.data)
        token_serializer.is_valid(raise_exception=True)
        tokens = token_serializer.validated_data

        # 얻은 정보를 응답
        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user_id': user.id,
            'username': user.username,
        }, status=status.HTTP_200_OK)

# 사용자 정보를 제공하는 API View
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    # 현재 인증된 사용자의 ID를 가져와서
    user_id = request.user.id  
    try:
        # ID에 해당하는 사용자를 찾는다
        user = CustomUser.objects.get(id=user_id)  
        # 사용자 정보를 직렬화
        serialized_user = {
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
        }
        # 직렬화한 정보를 응답
        return Response(serialized_user)
    except CustomUser.DoesNotExist:
        # 사용자가 존재하지 않으면 에러 메시지를 응답
        return Response({'error': '사용자를 찾을 수 없습니다.'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request):
    try:
        # Retrieve the logged-in user's name from the request
        follower_id = request.user.full_name

        # Convert the request body to JSON
        data = json.loads(request.body)

        # Include the follower_id in the data
        data['follower_id'] = follower_id

        # Use the serializer to validate the modified data
        serializer = FollowUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Access validated data using serializer.data
        following_id = serializer.data['following_id']

        # Get the CustomUser objects for the follower and following users
        follower = CustomUser.objects.get(full_name=follower_id)
        following = CustomUser.objects.get(full_name=following_id)

        # Save the relationship in the followings field
        follower.followings.add(following)

        return Response({'message': 'Success', 'follower_id': follower_id, 'following_id': following_id})

    except json.JSONDecodeError as e:
        return Response({'message': 'Error', 'error': 'Invalid JSON data'}, status=status.HTTP_400_BAD_REQUEST)

    except serializers.ValidationError as e:
        return Response({'message': 'Error', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    except CustomUser.DoesNotExist:
        return Response({'message': 'Error', 'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'message': 'Error', 'error': str(e)})