# Generated by Django 3.2.3 on 2021-06-05 06:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0013_alter_note_og'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='note',
            name='og',
        ),
    ]
