from django.urls import path
from .views import xfilter_views, comment_views, base_views

app_name = 'board'

urlpatterns = [
    # base
    path('xfilter/', base_views.xfilter_list, name='xfilter-list'),
    path('xfilter/<int:xfilter_id>/', base_views.xfilter_detail, name='xfilter-detail'),


    # xfilter
    path('xfilter/create', xfilter_views.xfilter_create_api, name='xfilter_create'),
    path('xfilter/modify/<int:xfilter_id>/', xfilter_views.xfilter_modify_api, name='xfilter_modify'),
    path('xfilter/delete/<int:xfilter_id>/', xfilter_views.xfilter_delete_api, name='xfilter_delete'),
    path('xfilter/vote/<int:xfilter_id>/', xfilter_views.xfilter_vote_api, name='xfilter_vote'),

    # comment
    path('comment/create/<int:xfilter_id>/', comment_views.comment_create_api, name='comment_create'),
    path('comment/modify/<int:comment_id>/', comment_views.comment_modify_api, name='comment_modify'),
    path('comment/delete/<int:comment_id>/', comment_views.comment_delete_api, name='comment_delete'),
    path('comment/vote/<int:comment_id>/', comment_views.comment_vote_api, name='comment_vote'),
]
