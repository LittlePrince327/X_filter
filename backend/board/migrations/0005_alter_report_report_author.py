# Generated by Django 4.2.6 on 2023-11-24 10:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0004_rename_author_report_report_author_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='report_author',
            field=models.TextField(),
        ),
    ]