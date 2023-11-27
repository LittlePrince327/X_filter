from login import views    
from django.urls import path 

urlpatterns = [
    path('user-signup/', views.UserSignup.as_view(), name='user-signup'),                # 회원가입
    path('user-login/', views.UserLogin.as_view(), name='user-login'),                   # 로그인
    path('get_user_info/', views.get_user_info, name='get_user_info'),                   # 사용자 정보 조회     
    path('follow/', views.follow_user, name='follow_user'),                              # 팔로우
    path('get_following_users/', views.get_following_users, name='get_following_users'), # 팔로우 유저 정보 조회
    path('get_followers/', views.get_followers, name='get_followers'),                   # 팔로워 유저 정보 조회
]


