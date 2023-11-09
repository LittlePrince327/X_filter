from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import Http404
from board.serializers import XfilterSerializer, CommentSerializer
from board.models import Xfilter, Comment
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xfilter_list(request):  
    kw = request.GET.get('kw', '')  
    xfilter_list = Xfilter.objects.order_by('-create_date')
    if kw:
        xfilter_list = xfilter_list.filter(
            Q(content__icontains=kw) |
            Q(author__icontains=kw)
        ).distinct()

    serializer = XfilterSerializer(xfilter_list, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def xfilter_detail(request, xfilter_id):  
    try:
        xfilter = Xfilter.objects.get(pk=xfilter_id)
    except Xfilter.DoesNotExist:
        raise Http404

    serializer = XfilterSerializer(xfilter)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comment_list(request):
    xfilter_id = request.GET.get('xfilter_id')  
    comment_list = Comment.objects.all()
    comment_list = Comment.objects.order_by('-create_date')
    if xfilter_id:
        comment_list = comment_list.filter(xfilter_id=xfilter_id)
    serializer = CommentSerializer(comment_list, many=True)
    return Response(serializer.data)