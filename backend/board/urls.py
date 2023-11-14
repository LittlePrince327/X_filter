from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import xfilter_views, comment_views, base_views

app_name = 'board'

urlpatterns = [
    # base
    path('xfilter/', base_views.xfilter_list, name='xfilter-list'),
    path('xfilter/<int:xfilter_id>/', base_views.xfilter_detail, name='xfilter-detail'),
    path('xfilter/comment/', base_views.comment_list, name='comment-list'),

    # xfilter
    path('xfilter/create', xfilter_views.xfilter_create_api, name='xfilter_create'),
    path('xfilter/delete/<int:xfilter_id>/', xfilter_views.xfilter_delete_api, name='xfilter_delete'),
    path('xfilter/vote/<int:xfilter_id>/', xfilter_views.xfilter_vote_api, name='xfilter_vote'),
    path('xfilter/like/<int:xfilter_id>/', xfilter_views.xfilter_likes_count_api, name='xfilter_like'),

    # comment
    path('comment/create/<int:xfilter_id>/', comment_views.comment_create_api, name='comment_create'),
    path('comment/delete/<int:comment_id>/', comment_views.comment_delete_api, name='comment_delete'),
    path('comment/vote/<int:comment_id>/', comment_views.comment_vote_api, name='comment_vote'),
    path('comment/like/<int:comment_id>/', comment_views.comment_likes_count_api, name='comment_vote'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
