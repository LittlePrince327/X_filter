from django import forms
from board.models import Xfilter, Comment


class XfilterForm(forms.ModelForm):
    class Meta:
        model = Xfilter  
        fields = ['content', 'create_date','author']  # author를 폼 필드로 포함


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        labels = {
            'content': '답변내용',
        }
