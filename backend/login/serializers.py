from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import IntegrityError
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if re.match(r'^[\w\.-]+@[\w\.-]+$', value):
            raise serializers.ValidationError("이메일 형태는 아이디로 사용할 수 없습니다.", code='invalid_username')
        return value

    def create(self, validated_data):
        try:
            user = get_user_model().objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password']
            )
            return user
        except IntegrityError as e:
            raise serializers.ValidationError("Username or email already exists.")

