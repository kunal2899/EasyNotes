# Generated by Django 3.2.3 on 2021-06-05 06:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0011_note_og'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='og',
            field=models.DateTimeField(default=None),
        ),
    ]
