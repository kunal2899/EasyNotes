from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework.views import APIView
from .serializers import UserSerializer, RegisterSerializer

# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response({
                "success": 1,
                "message":"User Created",
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                # "token": AuthToken.objects.create(user)[1],
            },status.HTTP_201_CREATED)
        return Response({
            "success":0,
            "message":serializer.errors,
        },status.HTTP_409_CONFLICT)

from django.contrib.auth import login

from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        print(request.data,'here')
        # serializer.is_valid(raise_exception=True)
        # user = serializer.validated_data['user']
        # login(request, user)
        # return super(LoginAPI, self).post(request, format=None)
        if(serializer.is_valid(raise_exception=True)):
            user = serializer.validated_data['user']
            login(request, user)
            print(type(request.user))
            data = super(LoginAPI, self).post(request, format=None).data
            data["success"]=1
            data["userId"]= user.id
            data["name"]=user.first_name
            data["message"]="Login success"
            return Response(data=data,status=status.HTTP_202_ACCEPTED)
        return Response(data={"message":serializer.errors,"success":0},status=status.HTTP_401_UNAUTHORIZED)

from django.contrib.auth.models import User

class getUserByUsername(APIView):
    def get(self, request, username, format=None):
        print(username)
        user = User.objects.get(username = username)
        return Response({
            "user": UserSerializer(user).data,
        })