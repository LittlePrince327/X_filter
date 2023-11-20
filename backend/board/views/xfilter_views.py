import json
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from board.forms import XfilterForm
from board.models import Xfilter, Comment

CustomUser = get_user_model()

# 게시글 작성
@csrf_exempt
def xfilter_create_api(request):
    # POST 메서드일 때 실행
    if request.method == "POST":
        try:
            # 요청 바디에서 JSON 데이터를 파싱
            data = json.loads(request.body)
            # XfilterForm을 사용하여 데이터 유효성 검사
            form = XfilterForm(data)
            # 유효한 경우 데이터 저장
            if form.is_valid():
                form.save()
                return JsonResponse({'message': 'XFilter created'}, status=200)
            # 유효하지 않은 경우 에러 응답 반환
            return JsonResponse({'message': 'Internal Server Error', 'details': form.errors}, status=500)
        except Exception as e:
            # 예외 발생 시 에러 응답 반환
            print(e)
            return JsonResponse({'message': 'Invalid form data', 'details': form.errors}, status=400)
    # POST 메서드가 아닌 경우 에러 응답 반환
    return JsonResponse({'message': 'Only POST requests allowed'}, status=405)

# 게시글 삭제
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def xfilter_delete_api(request,xfilter_id): 
    try:
        # 주어진 xfilter_id에 해당하는 Xfilter 객체 가져오기
        post = get_object_or_404(Xfilter, id=xfilter_id)
        # 게시물 삭제
        post.delete()
        return JsonResponse({'message': '게시물이 성공적으로 삭제되었습니다.'})
    except Xfilter.DoesNotExist:
        # Xfilter이 존재하지 않는 경우 에러 응답 반환
        return JsonResponse({'message': '게시물을 찾을 수 없습니다.'}, status=404)
    except Exception as e:
        # 예외 발생 시 에러 응답 반환
        return JsonResponse({'message': str(e)}, status=500)
    

# 게시글 추천
@csrf_exempt
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def xfilter_vote_api(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    user = request.user
    if request.method == 'POST':
        if user in xfilter.voter.all():
            xfilter.voter.remove(user)
            return JsonResponse({'message': '좋아요가 취소되었습니다.'})
        else:
            xfilter.voter.add(user)
            return JsonResponse({'message': '좋아요가 추가되었습니다.'})
    elif request.method == 'DELETE':
        xfilter.voter.remove(user)
        return JsonResponse({'message': '좋아요가 취소되었습니다.'})


# 게시글 추천 수
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xfilter_likes_count_api(request, xfilter_id):
    # 주어진 xfilter_id에 해당하는 Xfilter 객체 가져오기
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    # 좋아요 수 계산
    likes_count = xfilter.voter.count()
    # 좋아요 수 응답
    return JsonResponse({'likes_count': likes_count}, status=200)

# 게시글 댓글 수
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xfitler_comment_count_api(request, xfilter_id):
    try:
        # 주어진 xfilter_id에 해당하는 Xfilter 객체 가져오기
        xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
        # 댓글 수 계산
        comment_count = Comment.objects.filter(xfilter_id=xfilter_id).count()
        # 댓글 수 응답
        return JsonResponse({'comment_count': comment_count}, status=200)
    except Xfilter.DoesNotExist:
        # Xfilter이 존재하지 않는 경우 에러 응답 반환
        return JsonResponse({'message': '게시물을 찾을 수 없습니다.'}, status=404)
    except Exception as e:
        # 예외 발생 시 에러 응답 반환
        return JsonResponse({'message': str(e)}, status=500)
