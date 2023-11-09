
from django.shortcuts import get_object_or_404
from django.utils import timezone
from board.forms import CommentForm
from board.models import Comment
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

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
                comment.xfilter_id = xfilter_id  
                comment.save()
                return JsonResponse({'message': 'Comment created'}, status=200)  
            return JsonResponse({'message': 'Invalid form data', 'details': form.errors}, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({'message': 'Internal Server Error'}, status=500)
    return JsonResponse({'message': 'Only POST requests allowed'}, status=405)

# comment 삭제 API 엔드포인트
def comment_delete_api(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user != comment.author:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    comment.delete()
    return JsonResponse({'success': 'Comment deleted'})

# comment 추천 API 엔드포인트
def comment_vote_api(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user == comment.author:
        return JsonResponse({'error': 'Cannot vote for your own comment'}, status=400)

    comment.voter.add(request.user)
    return JsonResponse({'success': 'Voted for the comment'})
