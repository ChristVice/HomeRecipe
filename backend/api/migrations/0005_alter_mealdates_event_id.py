# Generated by Django 4.2.3 on 2024-02-23 03:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_mealdates_event_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mealdates',
            name='event_id',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
