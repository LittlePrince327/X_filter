from django.contrib import admin
from .models import Xfilter


class XfilterAdmin(admin.ModelAdmin):
    search_fields = ['subject']


admin.site.register(Xfilter, XfilterAdmin)
