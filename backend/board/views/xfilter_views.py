from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from board.forms import XfilterForm
from board.models import Xfilter
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

def xfilter_create(request):
    user = CustomUser.objects.get(id=request.user.id)
    
    if request.method == 'POST':
        form = XfilterForm(request.POST)
        if form.is_valid():
            xfilter = form.save(commit=False)
            xfilter.author = user  
            xfilter.create_date = timezone.now()
            xfilter.save()
            return redirect('board:index')
    else:
        form = XfilterForm()
    context = {'form': form}
    return render(request, 'board/xfilter_form.html', context)


def xfilter_modify(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    if request.user != xfilter.author:
        messages.error(request, '수정권한이 없습니다')
        return redirect('board:detail', xfilter_id=xfilter.id)
    if request.method == "POST":
        form = XfilterForm(request.POST, instance=xfilter)
        if form.is_valid():
            xfilter = form.save(commit=False)
            xfilter.modify_date = timezone.now()  # 수정일시 저장
            xfilter.save()
            return redirect('board:detail', xfilter_id=xfilter.id)
    else:
        form = XfilterForm(instance=xfilter)
    context = {'form': form}
    return render(request, 'board/xfilter_form.html', context)


def xfilter_delete(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    if request.user != xfilter.author:
        messages.error(request, '삭제권한이 없습니다')
        return redirect('board:detail', xfilter_id=xfilter.id)
    xfilter.delete()
    return redirect('board:index')


def xfilter_vote(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    if request.user == xfilter.author:
        messages.error(request, '본인이 작성한 글은 추천할수 없습니다')
    else:
        xfilter.voter.add(request.user)
    return redirect('board:detail', xfilter_id=xfilter.id)
