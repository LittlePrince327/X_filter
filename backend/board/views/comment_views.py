
from django.shortcuts import get_object_or_404
from django.utils import timezone
from board.forms import CommentForm
from board.models import Comment
from django.contrib.auth import get_user_model
from django.http import JsonResponse

CustomUser = get_user_model()

# Create API endpoint for creating a comment
def comment_create_api(request, xfilter_id):
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.author = CustomUser.objects.get(id=request.user.id)
            comment.create_date = timezone.now()
            comment.xfilter_id = xfilter_id  # Assuming xfilter_id is the foreign key
            comment.save()
            return JsonResponse({'comment_id': comment.id, 'xfilter_id': xfilter_id})
        return JsonResponse({'error': 'Invalid form data'}, status=400)
    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)

# Create API endpoint for modifying a comment
def comment_modify_api(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user != comment.author:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    if request.method == "POST":
        form = CommentForm(request.POST, instance=comment)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.modify_date = timezone.now()
            comment.save()
            return JsonResponse({'success': 'Comment modified'})
        return JsonResponse({'error': 'Invalid form data'}, status=400)
    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)

# Create API endpoint for deleting a comment
def comment_delete_api(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user != comment.author:
        return JsonResponse({'error': 'Permission denied'}, status=403)

    comment.delete()
    return JsonResponse({'success': 'Comment deleted'})

# Create API endpoint for voting on a comment
def comment_vote_api(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user == comment.author:
        return JsonResponse({'error': 'Cannot vote for your own comment'}, status=400)

    comment.voter.add(request.user)
    return JsonResponse({'success': 'Voted for the comment'})
