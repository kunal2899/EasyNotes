from .views import createNote, getNote, getNotesBetween, removeNote, setPin, updateNote
from django.urls import path,include

urlpatterns = [
    path('<str:uname>/add/<str:color>',createNote.as_view(),name="addnote"),
    path('get/<int:nid>',getNote.as_view(),name="getnote"),
    path('<str:uname>/getall/<str:from_>/<str:to_>',getNotesBetween.as_view(),name="getnotes"),
    path('update/<str:uname>/<int:nid>',updateNote.as_view(),name="updatenote"),
    path('remove/<int:nid>',removeNote.as_view(),name="removeNote"),
    path('setpin/<str:uname>/<int:nid>',setPin.as_view(),name="setPin")
]