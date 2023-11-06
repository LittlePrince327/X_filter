from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer

class UserProfileView(APIView):
    def get(self, request):
        # 현재 로그인한 사용자의 프로필 정보를 반환
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

class UserProfileEditView(APIView):
    def put(self, request):
        # 프로필 업데이트 로직을 구현 (serializers와 함께 사용 가능)
        user_profile = UserProfile.objects.get(user=request.user)

        # 데이터 업데이트 로직을 구현하고 UserProfileSerializer를 사용하여 업데이트
        serializer = UserProfileSerializer(user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
