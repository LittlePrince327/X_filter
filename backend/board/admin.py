from django.contrib import admin
from .models import Xfilter, Comment

class XfilterAdmin(admin.ModelAdmin):
    search_fields = ['subject']

class CommentAdmin(admin.ModelAdmin):
    # Comment 모델에 대한 어드민 설정이 필요한 경우 작성
    pass

admin.site.register(Xfilter, XfilterAdmin)
admin.site.register(Comment, CommentAdmin)
