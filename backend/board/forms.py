from django import forms
from board.models import Xfilter, Comment


class XfilterForm(forms.ModelForm):
    create_date = forms.DateTimeField(
        input_formats=['%Y/%m/%d %H:%M:%S'],
        widget=forms.DateTimeInput(attrs={'placeholder': 'YYYY/MM/DD HH:MM:SS'}),
    )
    class Meta:
        model = Xfilter  
        fields = ['content', 'create_date','author']  # author를 폼 필드로 포함


class CommentForm(forms.ModelForm):
    create_date = forms.DateTimeField(
        input_formats=['%Y/%m/%d %H:%M:%S'],
        widget=forms.DateTimeInput(attrs={'placeholder': 'YYYY/MM/DD HH:MM:SS'}),
    )
    class Meta:
        model = Comment
        fields = ['content']
        labels = {
            'content': '답변내용',
        }
