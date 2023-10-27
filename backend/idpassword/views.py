from django.http import JsonResponse, HttpRequest
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

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
