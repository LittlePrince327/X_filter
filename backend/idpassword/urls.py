from . import views
from django.urls import path
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('findusername', views.get_username_by_email, name='findusername'),                       # 이메일로 아이디 찾기
    path('resetpassword', views.reset_password, name="resetpassword"),                            # 아이디와 이메일로 사용자 정보 조회
    path('password_reset/', auth_views.PasswordResetView.as_view(), name="password_reset"),       # 아이디와 이메일로 사용자 정보 조회 후 비밀번호 재설정
]