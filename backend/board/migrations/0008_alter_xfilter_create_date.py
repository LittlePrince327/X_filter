# Generated by Django 4.2.6 on 2023-11-07 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0007_remove_xfilter_subject'),
    ]

    operations = [
        migrations.AlterField(
            model_name='xfilter',
            name='create_date',
            field=models.DateTimeField(),
        ),
    ]