from django.db import models

class FileUploadModel(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    chat_message = models.TextField()  # 채팅 메시지를 저장하는 필드
    file = models.FileField(upload_to='uploads/')

    def __str__(self):
        return self.file.name
