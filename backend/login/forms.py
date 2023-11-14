from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserForm(UserCreationForm):
    email = forms.EmailField(label="이메일")
    name = forms.CharField(max_length=50, required=False, label="이름")
    profile_picture = forms.ImageField(required=False, label="프로필 사진")

    class Meta:
        model = User
        fields = ("username", "password1", "password2", "email", "name", "profile_picture")
