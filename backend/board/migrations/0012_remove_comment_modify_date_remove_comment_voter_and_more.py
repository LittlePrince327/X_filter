# Generated by Django 4.2.6 on 2023-11-09 02:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0011_alter_xfilter_author'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='modify_date',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='voter',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='xfilter',
        ),
        migrations.RemoveField(
            model_name='xfilter',
            name='modify_date',
        ),
        migrations.AddField(
            model_name='comment',
            name='xfilter_id',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='create_date',
            field=models.DateTimeField(),
        ),
    ]
