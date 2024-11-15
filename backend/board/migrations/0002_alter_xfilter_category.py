# Generated by Django 4.2.6 on 2023-11-24 01:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='xfilter',
            name='category',
            field=models.CharField(choices=[('My List', '내 글'), ('All', '전체'), ('Daily', '일상'), ('Sports', '스포츠'), ('Politics', '정치'), ('Technology', '기술'), ('Entertainment', '엔터테인먼트'), ('Science and Nature', '과학과 자연'), ('Gaming', '게임'), ('Books and Literature', '책과 문학'), ('Health and Fitness', '건강과 피트니스'), ('Travel', '여행'), ('Food and Cooking', '음식과 요리'), ('Art and Creativity', '미술과 창작'), ('Technology Help/Support', '기술 지원/도움말')], default='All', max_length=200),
        ),
    ]
