import logging

from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import render, get_object_or_404

from board.models import Xfilter

logger = logging.getLogger('board')


def index(request):
    logger.info("INFO 레벨로 출력")
    page = request.GET.get('page', '1')  # 페이지
    kw = request.GET.get('kw', '')  # 검색어
    xfilter_list = Xfilter.objects.order_by('-create_date')
    if kw:
        xfilter_list = xfilter_list.filter(
            Q(subject__icontains=kw) |  # 제목
            Q(content__icontains=kw) |  # 내용
            Q(comment__content__icontains=kw) |  # 답변내용
            Q(author__username__icontains=kw) |  # 질문 글쓴이
            Q(comment__author__username__icontains=kw)  # 답변 글쓴이
        ).distinct()
    paginator = Paginator(xfilter_list, 10)  # 페이지당 10개씩 보여주기
    page_obj = paginator.get_page(page)
    context = {'xfilter_list': page_obj, 'page': page, 'kw': kw}
    return render(request, 'board/xfilter_list.html', context)


def detail(request, xfilter_id):
    xfilter = get_object_or_404(Xfilter, pk=xfilter_id)
    context = {'xfilter': xfilter}
    return render(request, 'board/xfilter_detail.html', context)
