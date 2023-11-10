from rest_framework import serializers
from .models import Xfilter, Comment

class XfilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Xfilter
        fields = ['id', 'content', 'create_date', 'author']  # 필요한 필드를 추가

# CommentSerializer는 xfilter_id를 포함하여 필드를 수정
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'create_date', 'author', 'xfilter_id']  # 필요한 필드를 추가
