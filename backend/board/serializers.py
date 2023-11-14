from rest_framework import serializers
from login.models import CustomUser
from .models import Xfilter, Comment

class XfilterSerializer(serializers.ModelSerializer):
    # 추가: member_number 필드에 대한 SerializerMethodField를 사용하여 profile_picture 가져오기
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Xfilter
        fields = ['id','member_number', 'author', 'content', 'create_date', 'category', 'voter', 'profile_picture']

    # 추가: SerializerMethodField를 위한 메소드 정의
    def get_profile_picture(self, obj):
        # obj.member_number은 CustomUser 모델의 인스턴스
        # 따라서 obj.member_number.profile_picture로 해당 유저의 profile_picture 값을 가져옴
        return str(obj.member_number.profile_picture)

# CommentSerializer는 xfilter_id를 포함하여 필드를 수정
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'create_date', 'author', 'xfilter_id']  # 필요한 필드를 추가
