from rest_framework import serializers
from .models import Xfilter, Comment

class XfilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Xfilter
        fields = ['id', 'subject', 'content', 'create_date', 'modify_date']  # 필요한 필드를 추가

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'text', 'create_date', 'modify_date']  # 필요한 필드를 추가
