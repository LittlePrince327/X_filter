from django.contrib import admin                                                           # Django에서 제공하는 관리자 페이지를 설정하기 위한 모듈을 가져옴
from django.urls import path, include                                                      # URL 패턴을 정의하기 위한 Django의 모듈을 가져옴
from login import views                                                                    # 'login' 애플리케이션에서 뷰 함수를 가져옴
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView           # Django Rest Framework에서 JSON Web Token(JWT)을 사용한 인증을 처리하기 위한 모듈을 가져옴. JWT는 사용자가 로그인하고 인증하는 데 사용되며, TokenObtainPairView는 JWT를 발급하고, TokenRefreshView는 기존 JWT를 갱신하는 데 사용
from django.views.decorators.csrf import csrf_exempt  # CSRF 보호를 제외하기 위한 모듈
from django.views.decorators.csrf import get_token  # get_token을 가져오기 위한 import 추가


urlpatterns = [
    path('admin/', admin.site.urls),                                                       # 사용자가 웹 브라우저에서 "/admin/"으로 이동하면, Django의 관리자 페이지로 이동
    path('api/', include('login.urls')),
    path('get-csrf-token/', csrf_exempt(get_token), name='get-csrf-token'),
    path('accounts/', include('django.contrib.auth.urls')),

]

