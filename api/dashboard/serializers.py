from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id','uname','color','title','content','created_on','pinned')

    # def create(self, validated_data):
    #     return super().create(title=validated_data['title'],userId=validated_data['userId'],content=validated_data['content'])