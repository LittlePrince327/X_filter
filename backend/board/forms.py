from django import forms
from board.models import Xfilter, Comment

class XfilterForm(forms.ModelForm):
    class Meta:
        model = Xfilter  
        fields = ['id','content', 'create_date', 'author', 'category', 'member_number']


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content', 'create_date', 'author','xfilter_id'] 