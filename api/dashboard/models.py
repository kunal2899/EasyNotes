from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE

from django.utils import timezone
import pytz

class Note(models.Model):
    title = models.CharField(max_length=255)
    # username = models.ForeignKey(User,on_delete=models.CASCADE)
    # uname = models.CharField(max_length=30,default='')
    uname = models.ForeignKey(User,to_field="username",on_delete=models.CASCADE)
    color = models.CharField(max_length=20,default='#6cff7d')
    content = models.TextField(blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    pinned = models.BooleanField(default=False)
    # og = models.DateTimeField(default=,timezone.activate(pytz.timezone('Asia/Kolkata')),null=True)
