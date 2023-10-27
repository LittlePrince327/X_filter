from django.http import JsonResponse

def reset_password(request):
    if request.method == 'POST':
        # 비밀번호 재설정 로직을 구현
        # 이메일을 받아서 해당 이메일로 등록된 사용자의 아이디(username)를 조회하고, 새 비밀번호를 설정하는 코드를 작성

        return JsonResponse({'message': '비밀번호가 재설정되었습니다.'})
    else:
        return JsonResponse({'message': '잘못된 요청입니다.'}, status=400)
