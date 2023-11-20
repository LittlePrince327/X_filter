from django.urls import path
from .views import xfilter_views, comment_views, base_views

app_name = 'board'

urlpatterns = [
    # base
    path('xfilter/', base_views.xfilter_list, name='xfilter-list'),                                                   # 게시글 및 작성자 정보 불러오기
    path('xfilter/<int:xfilter_id>/', base_views.xfilter_detail, name='xfilter-detail'),                              # 게시글 상세 정보 불러오기
    path('xfilter/comment/', base_views.comment_list, name='comment-list'),                                           # 댓글 불러오기

    # xfilter 
    path('xfilter/create', xfilter_views.xfilter_create_api, name='xfilter_create'),                                  # 게시글 작성
    path('xfilter/delete/<int:xfilter_id>/', xfilter_views.xfilter_delete_api, name='xfilter_delete'),                # 게시글 삭제
    path('xfilter/vote/<int:xfilter_id>/', xfilter_views.xfilter_vote_api, name='xfilter_vote'),                      # 게시글 좋아요
    path('xfilter/like/<int:xfilter_id>/', xfilter_views.xfilter_likes_count_api, name='xfilter_like_count'),         # 게시글 좋아요 수
    path('xfilter/comments_count/<int:xfilter_id>/', xfilter_views.xfitler_comment_count_api, name='xfilter_comment'),# 게시글 댓글 수 

    # comment
    path('comment/create/<int:xfilter_id>/', comment_views.comment_create_api, name='comment_create'),                # 댓글 작성
    path('comment/delete/<int:comment_id>/', comment_views.comment_delete_api, name='comment_delete'),                # 댓글 삭제
    path('comment/vote/<int:comment_id>/', comment_views.comment_vote_api, name='comment_vote'),                      # 댓글 좋아요
    path('comment/like/<int:comment_id>/', comment_views.comment_likes_count_api, name='comment_like_count'),         # 댓글 좋아요 수
]
