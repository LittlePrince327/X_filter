from login.models import CustomUser
from django.db import models


class Xfilter(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='author_xfilter')
    subject = models.CharField(max_length=200)
    content = models.TextField()
    create_date = models.DateTimeField()
    modify_date = models.DateTimeField(null=True, blank=True)
    voter = models.ManyToManyField(CustomUser, related_name='voter_xfilter')

    def __str__(self):
        return self.subject


class Comment(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='author_comment')
    xfilter = models.ForeignKey(Xfilter, on_delete=models.CASCADE)
    content = models.TextField()
    create_date = models.DateTimeField()
    modify_date = models.DateTimeField(null=True, blank=True)
    voter = models.ManyToManyField(CustomUser, related_name='voter_comment')

