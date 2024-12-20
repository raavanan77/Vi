from rest_framework import serializers
from .models import User,TestcaseHandler,DeviceHandler

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestcaseHandler
        fields = '__all__'