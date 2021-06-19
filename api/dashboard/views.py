from .models import Note
import arrow
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import NoteSerializer
from django.db.models.query_utils import Q

# Create your views here.
class createNote(APIView):
    def post(self,request,uname,color,format=None):
        obj = request.data
        obj["color"] = color
        obj["uname"] = User.objects.get(username = uname)
        serializer = NoteSerializer(data=obj)
        if(serializer.is_valid(raise_exception=True)):
            print(obj)
            note = serializer.save()
            return Response({
                "success": 1,
                "message":"Note Created",
            },status.HTTP_201_CREATED)
        return Response({
            "success":0,
            "message":serializer.errors,
        },status.HTTP_409_CONFLICT)

class setPin(APIView):
    def put(self,request,nid,uname,format=None):
        note = Note.objects.get(id = nid)
        note.pinned = not(note.pinned)
        obj = {}
        obj["title"] = note.title
        obj["content"] = note.content
        obj["uname"] = User.objects.get(username = uname)
        serializer = NoteSerializer(note,data=obj)
        if(serializer.is_valid(raise_exception=True)):
            n1 = serializer.save()
            return Response({
                "success": 1,
                "message":"Note Updated",
            },status.HTTP_201_CREATED)
        return Response({
            "success":0,
            "message":serializer.errors,
        },status.HTTP_409_CONFLICT)
        

class updateNote(APIView):
    def put(self,request,uname,nid,format=None):
        note = Note.objects.get(id = nid)
        obj = request.data
        obj["uname"] = User.objects.get(username = uname)
        serializer = NoteSerializer(note,data=obj)
        if(serializer.is_valid(raise_exception=True)):
            n1 = serializer.save()
            return Response({
                "success": 1,
                "message":"Note Updated",
            },status.HTTP_201_CREATED)
        return Response({
            "success":0,
            "message":serializer.errors,
        },status.HTTP_409_CONFLICT)

class getNote(APIView):
    def get(self,request,nid,format=None):
        # print(nid)
        note = Note.objects.get(id = nid)
        return Response({
            "user": NoteSerializer(note).data,
        })

class removeNote(APIView):
    def delete(self,request,nid,format=None):
        note = Note.objects.get(id = nid)
        note.delete()
        return Response({
            "msg": "Note id: "+str(nid)+" deleted successfully",
        })

class getNotesBetween(APIView):
    def get(self,request,from_,to_,uname,format=None):
        if(from_ == '0'):
            user = User.objects.get(username = uname)
            from_ = user.date_joined
        note = Note.objects.filter(Q(created_on__gte = from_) | Q(created_on__lte = to_),uname = uname)
        result = {}
        for x in note:
            utc = arrow.get(x.created_on)
            local = utc.to('Asia/Kolkata')
            curr = arrow.utcnow()
            prev = curr.shift(days=-1)
            prevDate = prev.strftime("%B")+" "+prev.strftime("%d")+", "+prev.strftime("%Y")
            currDate = curr.strftime("%B")+" "+curr.strftime("%d")+", "+curr.strftime("%Y")
            obj = local.strftime("%B")+" "+local.strftime("%d")+", "+local.strftime("%Y")
            if(obj == currDate):
                obj = "TODAY "+currDate
            elif(obj == prevDate):
                obj = "YESTERDAY "+prevDate
            data = NoteSerializer(x).data
            if obj not in result.keys():
                result[obj] = [data,]
                continue
            result[obj].append(data)
        # data = NoteSerializer(note,many=True).data
        return Response({
            "notes": result,
            "keys": result.keys()
        })

