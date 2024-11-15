import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from board.forms import CommentForm
from board.models import Comment

CustomUser = get_user_model()

# comment 생성 API 엔드포인트
@csrf_exempt
def comment_create_api(request, xfilter_id):
    if request.method == "POST":
        try:
            # 요청으로부터 JSON 데이터를 파싱
            data = json.loads(request.body)
            # CommentForm을 사용하여 데이터 유효성을 검사
            form = CommentForm(data)
            if form.is_valid():
                # Comment 객체를 생성하지만 DB에는 저장하지 않음
                comment = form.save(commit=False)
                comment.save()
                return JsonResponse({'message': 'Comment created'}, status=200)
            # 유효성 검사에 실패한 경우 에러 응답
            return JsonResponse({'message': 'Invalid form data', 'details': form.errors}, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Internal Server Error'}, status=500)
    # POST 요청이 아닌 경우 에러 응답
    return JsonResponse({'message': 'Only POST requests allowed'}, status=405)


# comment 삭제 API 엔드포인트
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def comment_delete_api(request, comment_id):
    try:
        # 주어진 comment_id에 해당하는 Comment 객체를 가져옴
        post = get_object_or_404(Comment, id=comment_id)
        # Comment 객체를 삭제
        post.delete()
        return JsonResponse({'message': '게시물이 성공적으로 삭제되었습니다.'})
    except Comment.DoesNotExist:
        # Comment를 찾을 수 없는 경우 에러 응답
        return JsonResponse({'message': '게시물을 찾을 수 없습니다.'}, status=404)
    except Exception as e:
        # 그 외 예외가 발생한 경우 에러 응답
        return JsonResponse({'message': str(e)}, status=500)


# comment 추천 API 엔드포인트
@csrf_exempt
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def comment_vote_api(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    user = request.user
    if request.method == 'POST':
        if user in comment.voter.all():
            comment.voter.remove(user)
            return JsonResponse({'message': '댓글 추천이 취소되었습니다.'})
        else:
            comment.voter.add(user)
            return JsonResponse({'message': '댓글이 추천되었습니다.'})
    elif request.method == 'DELETE':
        comment.voter.remove(user)
        return JsonResponse({'message': '댓글 추천이 취소되었습니다.'})


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comment_likes_count_api(request, comment_id):
    # 주어진 comment_id에 해당하는 Comment 객체를 가져옴
    comment = get_object_or_404(Comment, pk=comment_id)
    # Comment의 좋아요 수 계산
    likes_count = comment.voter.count()
    # 계산된 좋아요 수 응답
    return JsonResponse({'likes_count': likes_count}, status=200)

