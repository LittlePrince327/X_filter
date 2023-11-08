from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import IntegrityError
import re
from login.models import CustomUser  # CustomUser 모델 임포트

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser  # CustomUser 모델로 변경
        fields = ['id', 'username', 'password', 'email', 'full_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = CustomUser.objects.create_user(  # CustomUser 모델로 변경
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                full_name=validated_data['full_name'],
            )
            return user
        except IntegrityError as e:
            raise serializers.ValidationError("Username or email already exists.")


