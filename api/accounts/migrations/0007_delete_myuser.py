# Generated by Django 3.2.3 on 2021-06-02 14:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_rename_profile_myuser'),
    ]

    operations = [
        migrations.DeleteModel(
            name='myuser',
        ),
    ]
