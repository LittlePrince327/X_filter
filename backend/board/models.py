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
    author = models.TextField(default=1)  
    xfilter_id = models.ForeignKey(
        Xfilter, 
        on_delete=models.CASCADE, 
        db_column='xfilter_id'
    )  # Allowing null and specifying a default value
    content = models.TextField()
    create_date = models.DateTimeField() 
    # voter = models.ManyToManyField(CustomUser, related_name='voter_comment')

    def __str__(self):
        return self.content[:50]  
