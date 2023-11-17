from django.db import models
from login.models import CustomUser

class Xfilter(models.Model):
    ALL = 'All'
    DAILY = 'Daily'
    SPORTS = 'Sports'
    POLITICS = 'Politics'
    TECHNOLOGY = 'Technology'
    ENTERTAINMENT = 'Entertainment'
    SCIENCE_NATURE = 'Science and Nature'
    GAMING = 'Gaming'
    BOOKS_LITERATURE = 'Books and Literature'
    HEALTH_FITNESS = 'Health and Fitness'
    TRAVEL = 'Travel'
    FOOD_COOKING = 'Food and Cooking'
    ART_CREATIVITY = 'Art and Creativity'
    TECH_SUPPORT = 'Technology Help/Support'

    CATEGORY_CHOICES = [
        (ALL, '전체'),
        (DAILY, '일상'),
        (SPORTS, '스포츠'),
        (POLITICS, '정치'),
        (TECHNOLOGY, '기술'),
        (ENTERTAINMENT, '엔터테인먼트'),
        (SCIENCE_NATURE, '과학과 자연'),
        (GAMING, '게임'),
        (BOOKS_LITERATURE, '책과 문학'),
        (HEALTH_FITNESS, '건강과 피트니스'),
        (TRAVEL, '여행'),
        (FOOD_COOKING, '음식과 요리'),
        (ART_CREATIVITY, '미술과 창작'),
        (TECH_SUPPORT, '기술 지원/도움말'),
    ]

    author = models.TextField(default=1)
    content = models.TextField()
    create_date = models.DateTimeField()
    category = models.CharField(max_length=200, choices=CATEGORY_CHOICES, default=ALL)
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