# Generated by Django 4.2.1 on 2023-12-23 22:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_favorites_meal_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='favorites',
            name='summary',
        ),
    ]
