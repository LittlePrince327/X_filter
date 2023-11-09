from login.models import CustomUser
from django.db import models

class Xfilter(models.Model):
    author = models.TextField(default=1)  
    content = models.TextField()
    create_date = models.DateTimeField()  
    # voter = models.ManyToManyField(CustomUser, related_name='voter_xfilter')

    def __str__(self):
        return self.content

class Comment(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='author_comment')
    xfilter = models.ForeignKey(Xfilter, on_delete=models.CASCADE)
    content = models.TextField()
    create_date = models.DateTimeField() 
    # voter = models.ManyToManyField(CustomUser, related_name='voter_comment')

    def __str__(self):
        return self.content[:50]  
