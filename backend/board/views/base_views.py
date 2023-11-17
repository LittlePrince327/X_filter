from django.http import Http404
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from board.models import Xfilter, Comment
from board.serializers import XfilterSerializer, CommentSerializer

# 게시글 및 작성자 정보 불러오기
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xfilter_list(request):  
    kw = request.GET.get('kw', '')  # 검색어를 가져오고
    category = request.GET.get('category', '')  # 카테고리를 가져오고
    author_name = request.GET.get('author_name', '')  # Get the author name
    xfilter_list = Xfilter.objects.order_by('-create_date')  # Xfilter 모델을 최신순으로 정렬

    if category:
        xfilter_list = xfilter_list.filter(category=category)  # 카테고리에 해당하는 게시글만 필터링

    if author_name:
        xfilter_list = xfilter_list.filter(author__iexact=author_name)  # Filter posts by exact author name match


    if kw:
        xfilter_list = xfilter_list.filter(
            Q(content__icontains=kw) |  # 내용에 검색어가 포함된 게시글을 필터링
            Q(author__icontains=kw)  # 작성자에 검색어가 포함된 게시글을 필터링
        ).distinct()

    serializer = XfilterSerializer(xfilter_list, many=True)
    return Response(serializer.data)

# 게시글 상세 정보 불러오기
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xfilter_detail(request, xfilter_id):  
    try:
        xfilter = Xfilter.objects.get(pk=xfilter_id)  # 주어진 xfilter_id에 해당하는 게시글을 가져온다
    except Xfilter.DoesNotExist:
        raise Http404

    serializer = XfilterSerializer(xfilter)
    return Response(serializer.data)


# 댓글 불러오기
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comment_list(request):
    xfilter_id = request.GET.get('xfilter_id')  # xfilter_id를 가져오고
    comment_list = Comment.objects.all()  # 모든 댓글을 가져오고
    comment_list = Comment.objects.order_by('-create_date')  # 댓글을 최신순으로 정렬
    if xfilter_id:
        comment_list = comment_list.filter(xfilter_id=xfilter_id)  # 주어진 xfilter_id에 해당하는 댓글만 필터링

    serializer = CommentSerializer(comment_list, many=True)
    return Response(serializer.data)
