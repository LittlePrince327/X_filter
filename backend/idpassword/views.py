import json
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import PasswordResetView
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

# 이메일을 통해 사용자 ID 찾기
@csrf_exempt
@require_POST
def get_username_by_email(request: HttpRequest):
    if request.method == 'POST':
        try:
            # 요청 바디에서 JSON 데이터를 파싱
            data = json.loads(request.body)
            email = data.get('email', '')
            if email:
                try:
                    # 이메일을 이용하여 사용자를 찾고
                    user = get_user_model().objects.get(email=email)
                    # 사용자의 아이디를 응답
                    return JsonResponse({'username': user.username}, status=200)
                except get_user_model().DoesNotExist:
                    # 사용자를 찾을 수 없는 경우 404 응답을 반환.
                    return JsonResponse({'message': 'User not found.'}, status=404)
            else:
                # 이메일이 제공되지 않은 경우 400 응답을 반환
                return JsonResponse({'message': 'Please enter your email.'}, status=400)
        except json.JSONDecodeError:
            # 요청 바디가 유효한 JSON이 아닌 경우 400 응답을 반환
            return JsonResponse({'message': 'Invalid JSON request.'}, status=400)
    else:
        # 요청 메서드가 POST가 아닌 경우 400 응답을 반환
        return JsonResponse({'message': 'Bad request.'}, status=400)


# ID와 이메일을 통한 회원 정보 확인
@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        try:
            # 요청 바디에서 JSON 데이터를 파싱
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            User = get_user_model()
            try:
                # 제공된 사용자 아이디와 이메일을 이용하여 사용자를 찾고
                User = User.objects.get(email=email, username=username)
                # 성공 메시지를 반환
                return JsonResponse({"message": "User found. Password reset has begun."})
            except User.DoesNotExist:
                # 사용자를 찾을 수 없는 경우 404 응답을 반환
                return JsonResponse({"error": "User not found."}, status=404)
        except json.JSONDecodeError:
            # 요청 바디가 유효한 JSON이 아닌 경우 400 응답을 반환
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    else:
        # 요청 메서드가 POST가 아닌 경우 405 응답을 반환
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)
