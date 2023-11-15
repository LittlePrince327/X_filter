from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

# 회원가입 시에 사용 될 사용자 생성 폼 정의
class UserForm(UserCreationForm):
    # 이메일을 입력 받는 필드를 추가
    email = forms.EmailField(label="Email")
    # 사용자의 이름을 입력 받는 필드를 추가
    name = forms.CharField(max_length=50, required=False, label="Name")

    # 기본 제공되는 User 모델과 연결되도록 설정
    class Meta:
        model = User
        # 사용자에게 보여질 필드들을 순서대로 정의
        fields = ("username", "password1", "password2", "email", "name")