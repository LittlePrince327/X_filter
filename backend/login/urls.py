from django.urls import path
from .views import UserSignup, UserLogin

urlpatterns = [
    path('api/user-signup/', UserSignup.as_view(), name='user-signup'),
    path('api/user-login/', UserLogin.as_view(), name='user-login'),
    # 다른 URL 경로를 추가할 수 있습니다.
]
