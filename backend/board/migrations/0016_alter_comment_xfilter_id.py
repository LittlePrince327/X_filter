# Generated by Django 4.2.6 on 2023-11-10 01:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0015_alter_comment_xfilter_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='xfilter_id',
            field=models.ForeignKey(db_column='xfilter_id', on_delete=django.db.models.deletion.CASCADE, to='board.xfilter'),
        ),
    ]