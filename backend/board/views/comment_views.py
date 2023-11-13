
from django.shortcuts import get_object_or_404
from django.utils import timezone
from board.forms import CommentForm
from board.models import Comment
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.views.decorators.http import require_http_methods
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

CustomUser = get_user_model()

# comment 생성 API 엔드포인트
@csrf_exempt
def comment_create_api(request, xfilter_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            form = CommentForm(data)
            if form.is_valid():
                comment = form.save(commit=False)
                comment.save()
                return JsonResponse({'message': 'Comment created'}, status=200)
            return JsonResponse({'message': 'Invalid form data', 'details': form.errors}, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Internal Server Error'}, status=500)
    return JsonResponse({'message': 'Only POST requests allowed'}, status=405)


# comment 삭제 API 엔드포인트
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def comment_delete_api(request, comment_id):
    try:
        post = get_object_or_404(Comment, id=comment_id)
        post.delete()
        return JsonResponse({'message': '게시물이 성공적으로 삭제되었습니다.'})
    except Comment.DoesNotExist:
        return JsonResponse({'message': '게시물을 찾을 수 없습니다.'}, status=404)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)

# comment 추천 API 엔드포인트
@csrf_exempt
def comment_vote_api(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    
    author = request.POST.get('author')  # 프론트엔드에서 전달한 author 값 가져오기

    if request.user == comment.author:
        return JsonResponse({'error': '자신의 댓글에 대해 투표할 수 없습니다.'}, status=400)

    if author != comment.author:
        return JsonResponse({'error': '유효하지 않은 사용자입니다.'}, status=400)

    if request.user in comment.voter.all():
        return JsonResponse({'error': '이미 이 댓글에 대해 투표했습니다.'}, status=400)

    comment.voter.add(request.user)
    return JsonResponse({'success': '댓글에 투표했습니다.'})