from django.urls import path
from . import views

urlpatterns = [
    path('findusername', views.get_username_by_email, name='reset_password'),
    path('resetpassword/', views.CustomPasswordResetView.as_view(), name="password_reset"),  
]
