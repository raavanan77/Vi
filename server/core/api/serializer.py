from rest_framework import serializers
from ..models import TestcaseHandler,DeviceHandler,DeviceMapper,DUTHandler

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestcaseHandler
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceHandler
        fields = '__all__'

class DeviceMapperSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceMapper
        fields = '__all__'

class DutSerializer(serializers.ModelSerializer):
    class Meta:
        model = DUTHandler
        fields = '__all__'