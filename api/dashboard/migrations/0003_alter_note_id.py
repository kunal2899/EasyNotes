# Generated by Django 3.2.3 on 2021-06-04 10:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_auto_20210604_1600'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='id',
            field=models.IntegerField(auto_created=True, primary_key=True, serialize=False),
        ),
    ]
