from login.models import CustomUser
from django.db import models

class Xfilter(models.Model):
    author = models.TextField(default=1)  # For example, setting a default author
    content = models.TextField()
    create_date = models.DateTimeField()  # 수정됨
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)  # 수정됨
    # voter = models.ManyToManyField(CustomUser, related_name='voter_xfilter')

    def __str__(self):
        return self.subject

class Comment(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='author_comment')
    xfilter = models.ForeignKey(Xfilter, on_delete=models.CASCADE)
    content = models.TextField()
    create_date = models.DateTimeField(auto_now_add=True)  # 수정됨
    modify_date = models.DateTimeField(auto_now=True, null=True, blank=True)  # 수정됨
    voter = models.ManyToManyField(CustomUser, related_name='voter_comment')

    def __str__(self):
        return self.content[:50]  # 여기서 50은 문자열을 적절히 자르는 길이를 나타냅니다.
