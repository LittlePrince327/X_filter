from django import forms
from board.models import Xfilter, Comment


class XfilterForm(forms.ModelForm):
    class Meta:
        model = Xfilter  
        fields = ['subject', 'content']  
        labels = {
            'subject': '제목',
            'content': '내용',
        }


class AnswerForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        labels = {
            'content': '답변내용',
        }
