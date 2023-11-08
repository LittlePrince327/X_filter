from django import forms
from board.models import Xfilter, Comment


class XfilterForm(forms.ModelForm):
    author = forms.CharField(max_length=50)  # 사용자의 이름을 나타내는 필드를 폼에 추가
    class Meta:
        model = Xfilter  
        fields = ['content', 'create_date', 'author']  # author를 폼 필드로 포함


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        labels = {
            'content': '답변내용',
        }
