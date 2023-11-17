from rest_framework import serializers
from django.db import IntegrityError
from login.models import CustomUser  

# 사용자 정보를 직렬화하는 클래스를 정의
class UserSerializer(serializers.ModelSerializer):
    # 직렬화할 모델을 지정
    class Meta:
        model = CustomUser 
        # 사용자 모델의 어떤 필드들을 직렬화할지 지정
        fields = ['id', 'username', 'password', 'email', 'full_name']
        # 'password' 필드는 읽기 전용(write_only)으로 설정
        extra_kwargs = {'password': {'write_only': True}}

    # 새로운 사용자를 생성하는 메서드를 정의
    def create(self, validated_data):
        try:
            # CustomUser 모델의 매니저를 사용하여 사용자를 생성
            user = CustomUser.objects.create_user(  
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                full_name=validated_data['full_name'],
            )
            # 생성된 사용자를 반환
            return user
        # IntegrityError는 데이터베이스에 중복된 정보를 입력할 때 발생하는 예외
        except IntegrityError as e:
            # 중복된 정보가 있으면 에러 메시지 발생
            raise serializers.ValidationError("Username or email already exists.")
        
class FollowUserSerializer(serializers.Serializer):
    follower_id = serializers.CharField()
    following_id = serializers.CharField()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'full_name']  