from login import views    
from django.urls import path 

urlpatterns = [
    path('user-signup/', views.UserSignup.as_view(), name='user-signup'),              # 회원가입
    path('user-login/', views.UserLogin.as_view(), name='user-login'),                 # 로그인
    path('get_user_info/', views.get_user_info, name='get_user_info'),                 # 사용자 정보 조회     
    path('follow/', views.follow_user, name='follow_user'),                            # 팔로우
]


