from django.contrib import admin                                                          
from django.urls import path, include                                                                                                                            

urlpatterns = [
    path('admin/', admin.site.urls),                                                       # Django의 관리자 페이지
    path('api/', include('login.urls')),                                                   # 회원가입 및 로그인
    path('board/', include('board.urls')),                                                 # 게시글
    path('idpassword/', include('idpassword.urls')),                                       # 아이디 및 비밀번호 찾기
]

