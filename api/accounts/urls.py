from django.urls import path,include
from knox import views as knox_views
from .views import RegisterAPI,LoginAPI,getUserByUsername

urlpatterns = [
    path('add',RegisterAPI.as_view(), name='register'),
    path('login', LoginAPI.as_view(), name='login'),
    path('uname/<str:username>', getUserByUsername.as_view(), name = 'uname'),
    path('logout', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall', knox_views.LogoutAllView.as_view(), name='logoutall'),
]