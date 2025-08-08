from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task

#Task Serializer
class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Task
        
        fields=['id', 'title', 'description', 'status', 'due_date', 'user']
        read_only_fields = ['user']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only':True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password']
        )

        return user