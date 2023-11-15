from django.contrib import admin
from .models import Xfilter, Comment

class XfilterAdmin(admin.ModelAdmin):
    search_fields = ['content']
    def __str__(self):
        return self.content  

class CommentAdmin(admin.ModelAdmin):

    pass

admin.site.register(Xfilter, XfilterAdmin)
admin.site.register(Comment, CommentAdmin)
