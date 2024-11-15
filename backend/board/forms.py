from django import forms
from board.models import Xfilter, Comment

class XfilterForm(forms.ModelForm):
    class Meta:
        model = Xfilter  
        fields = ['content', 'create_date', 'author', 'category']  


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content', 'create_date', 'author','xfilter_id'] 