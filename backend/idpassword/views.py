from django.http import JsonResponse, HttpRequest
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import PasswordResetView
from django.shortcuts import render
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.exceptions import ObjectDoesNotExist

@csrf_exempt
@require_POST
def get_username_by_email(request: HttpRequest):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email', '')
            if email:
                try:
                    user = get_user_model().objects.get(email=email)
                    return JsonResponse({'username': user.username}, status=200)
                except get_user_model().DoesNotExist:
                    return JsonResponse({'message': '사용자를 찾을 수 없습니다.'}, status=404)
            else:
                return JsonResponse({'message': '이메일을 입력해주세요.'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': '잘못된 JSON 요청입니다.'}, status=400)
    else:
        return JsonResponse({'message': '잘못된 요청입니다.'}, status=400)

def reset_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')

            try:
                user = get_user_model().objects.get(email=email, username=username)
                # Assuming you'd trigger the password reset mechanism here
                # For example, generating a password reset token and sending an email to the user
                # For the sake of this example, let's return a success message
                return JsonResponse("User found. Password reset initiated.")
            except ObjectDoesNotExist:
                return JsonResponse({"error": "User not found."}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)
    # new_password = request.POST.get('new_password')
    # confirm_password = request.POST.get('confirm_password')

    # if not (username and email ):
    #     return JsonResponse({'message': '모든 필드를 입력하세요.'}, status=400)

    # user_model = get_user_model()
    # try:
    #     user = user_model.objects.get(username=username, email=email)
    # except user_model.DoesNotExist:
    #     return JsonResponse({'message': '입력한 정보와 일치하는 사용자를 찾을 수 없습니다.'}, status=400)

class UserPasswordResetView(PasswordResetView):
    template_name = 'registration/password_reset_email.html'

    def form_valid(self, form):
        UserModel = get_user_model()
        email = self.request.POST.get("email")

        # 이메일을 이용하여 사용자 가져오기
        user = self.get_user_by_email(email)
        if user:
            opts = {
                'use_https': self.request.is_secure(),
                'token_generator': default_token_generator,
                'from_email': None,  # 사용자가 설정한 이메일로 변경
                'email_template_name': self.email_template_name,
                'subject_template_name': self.subject_template_name,
                'request': self.request,
                'html_email_template_name': self.html_email_template_name,
                'extra_email_context': self.extra_email_context,
            }
            form.save(**opts)
            
            # 비밀번호 재설정 URL 생성
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = reverse('password_reset_confirm', kwargs={'uidb64': uidb64, 'token': token})
            
            # 사용자에게 전송할 이메일 생성
            email_subject = '비밀번호 재설정을 위한 안내'
            email_body = f'비밀번호 재설정을 위한 링크: {reset_url}'
            send_mail(email_subject, email_body, 'iamdoxoak@gmail.com', [user.email])

            return super().form_valid(form)
        else:
            return render(self.request, 'registration/password_reset_done_fail.html')

    def get_user_by_email(self, email):
        try:
            user = get_user_model().objects.get(email=email)
            return user
        except get_user_model().DoesNotExist:
            return None
