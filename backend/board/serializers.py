from .models import Xfilter, Comment, Report
from rest_framework import serializers

class XfilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Xfilter
        fields = ['id', 'content', 'create_date', 'author','category']  


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content', 'create_date', 'author', 'xfilter_id']  



class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'content', 'author', 'reporter', 'category']

