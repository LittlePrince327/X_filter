from django.contrib import admin
from .models import Xfilter, Comment

class XfilterAdmin(admin.ModelAdmin):
    search_fields = ['content']
    def __str__(self):
        return self.content  # 이와 같이 사용 가능한 필드로 수정합니다

class CommentAdmin(admin.ModelAdmin):
    # Comment 모델에 대한 어드민 설정이 필요한 경우 작성
    pass

admin.site.register(Xfilter, XfilterAdmin)
admin.site.register(Comment, CommentAdmin)
