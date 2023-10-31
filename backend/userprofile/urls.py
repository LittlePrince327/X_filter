# backend/userprofile/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('user-profile-edit/<int:pk>/', views.UserProfileUpdateView.as_view(), name='user-profile-edit'),
]
