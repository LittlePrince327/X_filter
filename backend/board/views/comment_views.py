from django.contrib import messages
from django.http import HttpResponseNotAllowed
from django.shortcuts import render, get_object_or_404, redirect, resolve_url
from django.utils import timezone
from board.forms import CommentForm
from board.models import Xfilter, Comment
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

def comment_create(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.author = CustomUser.objects.get(id=request.user.id) 
            comment.create_date = timezone.now()
            comment.xfilter = xfilter
            comment.save()
            return redirect('{}#comment_{}'.format(
                resolve_url('board:detail', xfilter_id=xfilter.id), comment.id))
    else:
        return HttpResponseNotAllowed('Only POST is possible.')
    context = {'xfilter': xfilter, 'form': form}
    return render(request, 'board/xfilter_detail.html', context)


def comment_modify(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user != comment.author:
        messages.error(request, '수정권한이 없습니다')
        return redirect('board:detail', xfilter_id=comment.xfilter.id)
    if request.method == "POST":
        form = CommentForm(request.POST, instance=comment)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.modify_date = timezone.now()
            comment.save()
            return redirect('{}#comment_{}'.format(
                resolve_url('board:detail', xfilter_id=comment.xfilter.id), comment.id))
    else:
        form = CommentForm(instance=comment)
    context = {'comment': comment, 'form': form}
    return render(request, 'board/comment_form.html', context)


def comment_delete(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user != comment.author:
        messages.error(request, '삭제권한이 없습니다')
        return redirect('board:detail', xfilter_id=comment.xfilter.id)
    else:
        comment.delete()
    return redirect('board:detail', xfilter_id=comment.xfilter.id)


def comment_vote(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id)
    if request.user == comment.author:
        messages.error(request, '본인이 작성한 글은 추천할 수 없습니다')
    else:
        comment.voter.add(request.user)
    return redirect('{}#comment_{}'.format(
                resolve_url('board:detail', xfilter_id=comment.xfilter.id), comment.id))
