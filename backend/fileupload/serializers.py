from rest_framework import serializers
from .models import FileUploadModel

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUploadModel
        fields = ('user', 'chat_message', 'file')

    def create(self, validated_data):
        # 업로드된 파일과 관련 정보를 사용하여 FileUpload 모델 객체를 생성하고 저장
        file_upload = FileUploadModel(
            user=self.context['request'].user,  # 현재 사용자
            chat_message=validated_data['chat_message'],
            file=validated_data['file']
        )
        file_upload.save()
        return file_upload
