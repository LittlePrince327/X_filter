from django import forms                                             # Django에서 제공하는 폼(Form) 클래스를 사용하기 위해 필요한 모듈을 가져옴. 폼은 웹 페이지에서 사용자 입력을 처리하고 검증하는 데 사용
from django.contrib.auth.forms import UserCreationForm               # Django의 내장 인증 시스템을 활용하여 사용자 등록 폼을 생성하는데 사용되는 UserCreationForm 클래스를 가져옴. 이 폼은 사용자 이름, 비밀번호, 이메일 등과 같은 필수 정보를 입력받아 새로운 사용자를 생성  
from django.contrib.auth.models import User                          # Django의 내장 사용자 모델인 User를 가져옴. 사용자 데이터베이스 테이블을 정의하고, 사용자 관리와 인증을 처리하는 데 사용


class UserForm(UserCreationForm):                                    # Django의 UserCreationForm 클래스를 상속받아 사용자 등록 양식을 커스텀화한 폼. UserCreationForm은 Django에서 기본적으로 제공하는 사용자 등록 폼
    email = forms.EmailField(label="이메일")                         # forms.EmailField는 이메일 주소를 입력받는 필드. 필드의 레이블을 "이메일"로 지정

    class Meta:                                                      # Meta 클래스는 모델과 폼 간의 관계를 정의하는 데 사용
        model = User                                                 # model은 User 모델을 사용하도록 설정되어 있으며, 이 모델은 사용자 정보를 저장하는 데 사용
        fields = ("username", "password1", "password2", "email")     # 사용자가 입력해야 하는 필드의 목록을 fields에 정의