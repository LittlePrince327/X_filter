from django.contrib import admin
from django.urls import path
from login import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user-signup/', views.UserSignup.as_view(), name='user-signup'),
    path('api/user-login/', views.UserLogin.as_view(), name='user-login'),
]

# CORS 관련 추가
urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
