# Generated by Django 3.2.3 on 2021-06-02 14:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admin', '0004_alter_logentry_user'),
        ('auth', '0012_alter_user_first_name_max_length'),
        ('knox', '0008_alter_authtoken_user'),
        ('accounts', '0005_profile'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='profile',
            new_name='myuser',
        ),
    ]
