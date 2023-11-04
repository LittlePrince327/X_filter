from django.urls import path

from .views import base_views, xfilter_views, comment_views

app_name = 'board'

urlpatterns = [
    # base
    path('', base_views.index, name='index'),
    path('<int:xfilter_id>/', base_views.detail, name='detail'),

    # xfilter
    path('xfilter/create/', xfilter_views.xfilter_create, name='xfilter_create'),
    path('xfilter/modify/<int:xfilter_id>/', xfilter_views.xfilter_modify, name='xfilter_modify'),
    path('xfilter/delete/<int:xfilter_id>/', xfilter_views.xfilter_delete, name='xfilter_delete'),
    path('xfilter/vote/<int:xfilter_id>/', xfilter_views.xfilter_vote, name='xfilter_vote'),

    # comment
    path('comment/create/<int:xfilter_id>/', comment_views.comment_create, name='comment_create'),
    path('comment/modify/<int:comment_id>/', comment_views.comment_modify, name='comment_modify'),
    path('comment/delete/<int:comment_id>/', comment_views.comment_delete, name='comment_delete'),
    path('comment/vote/<int:comment_id>/', comment_views.comment_vote, name='comment_vote'),
]
