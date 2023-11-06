from django.urls import path
from . import views

urlpatterns = [
    # 다른 URL 패턴들...
    path('api/user-profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('api/user-profile/edit/', views.UserProfileEditView.as_view(), name='edit_user_profile'),
]
