from django.db import models
from login.models import CustomUser

class Xfilter(models.Model):
    ALL = 'All'
    DAILY = 'Daily'
    SPORTS = 'Sports'
    POLITICS = 'Politics'

    CATEGORY_CHOICES = [
        (ALL, '전체'),
        (DAILY, '일상'),
        (SPORTS, '스포츠'),
        (POLITICS, '정치'),
    ]
    member_number = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    author = models.TextField(default=1)
    content = models.TextField()
    create_date = models.DateTimeField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default=ALL)
    voter = models.ManyToManyField(CustomUser, related_name='voter_xfilter')

    def __str__(self):
        return self.content

class Comment(models.Model):
    author = models.TextField(default=1)  
    xfilter_id = models.ForeignKey(Xfilter, on_delete=models.CASCADE, db_column='xfilter_id')  
    content = models.TextField()
    create_date = models.DateTimeField() 
    voter = models.ManyToManyField(CustomUser, related_name='voter_comment')

    def __str__(self):
        return self.content[:50]  