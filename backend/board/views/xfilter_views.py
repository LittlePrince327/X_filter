from django.shortcuts import get_object_or_404
from django.utils import timezone
from board.forms import XfilterForm
from board.models import Xfilter
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


CustomUser = get_user_model()

# XFilter 생성 API 엔드포인트
@csrf_exempt
def xfilter_create_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
            form = XfilterForm(data)
            if form.is_valid():
                form.save()
                return JsonResponse({'message': 'XFilter created'}, status=200)
            return JsonResponse({'message': 'Internal Server Error', 'details': form.errors}, status=500)
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Invalid form data', 'details': form.errors}, status=400)
    return JsonResponse({'message': 'Only POST requests allowed'}, status=405)

# XFilter 삭제 API 엔드포인트
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def xfilter_delete_api(request, xfilter_id):  # 'post_id'를 'xfilter_id'로 변경
    try:
        post = get_object_or_404(Xfilter, id=xfilter_id)
        post.delete()
        return JsonResponse({'message': '게시물이 성공적으로 삭제되었습니다.'})
    except Xfilter.DoesNotExist:
        return JsonResponse({'message': '게시물을 찾을 수 없습니다.'}, status=404)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    

# XFilter 추천 API 엔드포인트
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def xfilter_vote_api(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data in the request body.'}, status=400)

    author_from_request = data.get('author')

    if xfilter.author == author_from_request:
        return JsonResponse({'error': '본인의 글에는 좋아요 표시를 할 수 없습니다.'}, status=400)

    if request.user in xfilter.voter.all():
        return JsonResponse({'error': '이미 좋아요 표시를 하였습니다.'}, status=400)

    xfilter.voter.add(request.user)
    xfilter.save()

    return JsonResponse({'success': 'XFilter에 투표했습니다.'}, status=200)

# XFilter 추천 수 API 엔드포인트
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xfilter_likes_count_api(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    likes_count = xfilter.voter.count()
    return JsonResponse({'likes_count': likes_count}, status=200)