from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # 나머지 필드들