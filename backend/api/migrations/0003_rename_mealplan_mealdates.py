# Generated by Django 4.2.3 on 2024-02-18 06:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_mealplan'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='MealPlan',
            new_name='MealDates',
        ),
    ]
