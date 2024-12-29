from rest_framework import serializers
from .models import TestcaseHandler,DeviceHandler

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestcaseHandler
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceHandler
        fields = '__all__'
