# Generated by Django 3.2.3 on 2021-06-05 06:39

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0010_note_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='og',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
