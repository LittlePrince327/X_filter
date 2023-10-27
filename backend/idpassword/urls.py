from django.urls import path
from . import views

urlpatterns = [
    path('reset_password/', views.reset_password, name='reset_password'),
    # 다른 URL 패턴을 여기에 추가할 수 있습니다.
]
