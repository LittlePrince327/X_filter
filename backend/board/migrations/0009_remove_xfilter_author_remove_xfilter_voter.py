# Generated by Django 4.2.6 on 2023-11-07 12:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0008_alter_xfilter_create_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='xfilter',
            name='author',
        ),
        migrations.RemoveField(
            model_name='xfilter',
            name='voter',
        ),
    ]