from django.http import JsonResponse, HttpRequest
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import PasswordResetView
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.forms import PasswordResetForm

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

class CustomPasswordResetView(PasswordResetView):
    email_template_name = 'registration/password_reset_email.html'  # 사용할 맞춤형 이메일 템플릿 지정

    def form_valid(self, form):
        username = self.request.POST.get('username')
        email = form.cleaned_data.get('email')
        
        user_model = get_user_model()
        
        try:
            user = user_model.objects.get(username=username, email=email)
        except user_model.DoesNotExist:
            return JsonResponse({'message': '입력한 username과 email이 일치하지 않습니다.'}, status=400)
        
        # 입력한 username과 email이 일치하는 경우에만 이메일 전송
        opts = {
            'use_https': self.request.is_secure(),
            'token_generator': default_token_generator,
            'from_email': None,
            'request': self.request,
        }
        form.save(**opts)
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        protocol = 'https' if self.request.is_secure() else 'http'
        domain = self.request.META['HTTP_HOST']
        context = {
            'protocol': protocol,
            'domain': domain,
            'uid': uid,
            'token': token,
            'site_name': 'YourSiteName',  # 사이트 이름을 변경해주세요
            'user': user,
            'subject': 'Password Reset',
            'email': email,
            'body': 'Please reset your password by clicking the link below:'
        }

        # 맞춤형 이메일 전송
        subject = 'Password Reset'
        email_body = render_to_string('registration/password_reset_email.html', context)
        send_mail(subject, email_body, None, [email])

        return JsonResponse({'message': '이메일을 확인해주세요.'})