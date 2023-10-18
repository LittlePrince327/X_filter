from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'password', 'email']

    # 비밀번호 필드 설정 추가
    extra_kwargs = {'password': {'write_only': True}}
    #  Django REST framework의 시리얼라이저 클래스에서 사용되는 옵션 
    #  password 필드가 요청 데이터에서만 사용되고 응답 데이터에는 포함되지 않도록 설정하는데 사용.
    #  이것은 사용자 생성 및 인증과 관련된 시나리오에서 보안적인 이유로 유용.

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


