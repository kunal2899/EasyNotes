# from .models import myuser
from rest_framework import serializers
from django.contrib.auth.models import User

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name','last_name','username', 'email')
        # files = '_all_'
        # exclude = ('id','last_login','is_superuser','is_staff','is_active','date_joined','user_permissions','groups')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name','last_name','email','username','password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],email = validated_data['email'],password = validated_data['password'],first_name = validated_data['first_name'],last_name = validated_data['last_name'])
        return user