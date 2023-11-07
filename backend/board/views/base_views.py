from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import Http404
from board.serializers import XfilterSerializer
from board.models import Xfilter
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xfilter_list(request):                                              # 검색기능 담당
    print(request.headers)  # 콘솔에서 헤더 확인
    kw = request.GET.get('kw', '')                                      # 검색어
    xfilter_list = Xfilter.objects.order_by('-create_date')
    if kw:
        xfilter_list = xfilter_list.filter(
            Q(subject__icontains=kw) |                                  # 제목
            Q(content__icontains=kw) |                                  # 내용
            Q(comment__content__icontains=kw) |                         # 답변내용
            Q(author__username__icontains=kw) |                         # 질문 글쓴이
            Q(comment__author__username__icontains=kw)                  # 답변 글쓴이
        ).distinct()

    serializer = XfilterSerializer(xfilter_list, many=True)
    return Response(serializer.data)

@api_view(['GET'])                                                     # 게시글 상세 조회
@permission_classes([IsAuthenticated])
def xfilter_detail(xfilter_id,request):
    print(request.headers)  # 콘솔에서 헤더 확인
    try:
        xfilter = Xfilter.objects.get(pk=xfilter_id)
    except Xfilter.DoesNotExist:
        raise Http404

    serializer = XfilterSerializer(xfilter)
    return Response(serializer.data)

