from django.urls import path                                                               # URL 패턴을 정의하기 위한 Django의 모듈을 가져옴
from login import views                                                                    # 'login' 애플리케이션에서 뷰 함수를 가져옴
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView           # Django Rest Framework에서 JSON Web Token(JWT)을 사용한 인증을 처리하기 위한 모듈을 가져옴. JWT는 사용자가 로그인하고 인증하는 데 사용되며, TokenObtainPairView는 JWT를 발급하고, TokenRefreshView는 기존 JWT를 갱신하는 데 사용


urlpatterns = [
    path('user-signup/', views.UserSignup.as_view(), name='user-signup'),              # 사용자가 웹 브라우저에서 "/api/user-signup/"으로 이동하면, views.UserSignup 클래스를 호출하여 사용자 등록(sign-up) 페이지로 이동
    path('user-login/', views.UserLogin.as_view(), name='user-login'),                 # 사용자가 웹 브라우저에서 "/api/user-login/"으로 이동하면, views.UserLogin 클래스를 호출하여 사용자 로그인(login) 페이지로 이동
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),           # 사용자가 웹 브라우저에서 "/api/token/"으로 이동하면, TokenObtainPairView 클래스를 호출하여 JWT(토큰)를 발급
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),          # 사용자가 웹 브라우저에서 "/api/token/refresh/"으로 이동하면, TokenRefreshView 클래스를 호출하여 기존의 JWT(토큰)를 갱신
    path('get_user_info/', views.get_user_info, name='get_user_info'),  # 새로운 URL 패턴을 추가하여 get_user_info 뷰에 연결
]


