from django.db import models
from django.contrib.auth.models import User

from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # 나머지 필드들...
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    class Meta:
        app_label = 'userprofile'  # 앱의 이름을 설정

    def __str__(self):
        return self.user.username
