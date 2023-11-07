from django import forms
from board.models import Xfilter, Comment


class XfilterForm(forms.ModelForm):
    class Meta:
        model = Xfilter  
        fields = ['content', 'create_date'] 


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        labels = {
            'content': '답변내용',
        }
