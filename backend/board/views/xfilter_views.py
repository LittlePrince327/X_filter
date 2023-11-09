from django.shortcuts import get_object_or_404
from django.utils import timezone
from board.forms import XfilterForm
from board.models import Xfilter
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

CustomUser = get_user_model()

# XFilter 생성 API 엔드포인트
@csrf_exempt
def xfilter_create_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            form = XfilterForm(data)
            if form.is_valid():
                form.save()
                return JsonResponse({'message': 'XFilter created'}, status=200)
            return JsonResponse({'message': 'Internal Server Error', 'details': form.errors}, status=500)
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Invalid form data', 'details': form.errors}, status=400)
    return JsonResponse({'message': 'Only POST requests allowed'}, status=405)

# XFilter 수정 API 엔드포인트
@csrf_exempt
def xfilter_modify_api(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    if not request.user.has_perm('board.change_xfilter', xfilter):
        return JsonResponse({'error': 'Permission denied'}, status=403)

    if request.method == "POST":
        form = XfilterForm(request.POST, instance=xfilter)
        if form.is_valid():
            xfilter = form.save(commit=False)
            xfilter.save()
            return JsonResponse({'success': 'XFilter modified'})
        return JsonResponse({'error': 'Invalid form data', 'details': form.errors}, status=400)
    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)

# XFilter 삭제 API 엔드포인트
@csrf_exempt
def xfilter_delete_api(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    if not request.user.has_perm('board.delete_xfilter', xfilter):
        return JsonResponse({'error': 'Permission denied'}, status=403)

    xfilter.delete()
    return JsonResponse({'success': 'XFilter deleted'})

# XFilter 추천 API 엔드포인트
@csrf_exempt
def xfilter_vote_api(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    if request.user == xfilter.author:
        return JsonResponse({'error': 'Cannot vote for your own XFilter'}, status=400)

    if request.user in xfilter.voter.all():
        return JsonResponse({'error': 'Already voted for this XFilter'}, status=400)

    xfilter.voter.add(request.user)
    return JsonResponse({'success': 'Voted for the XFilter'})
