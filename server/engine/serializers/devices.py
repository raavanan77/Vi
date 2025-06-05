from rest_framework import serializers
from ..models import DeviceHandler,DeviceMapper,DUTHandler,ClientModel

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceHandler
        fields = '__all__'

    def to_representation(self, instance):
        return super().to_representation(instance)

class DutSerializer(serializers.ModelSerializer):
    class Meta:
        model = DUTHandler
        fields = '__all__'
    
    def to_representation(self, instance):
        return super().to_representation(instance)

class ClientTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientModel
        fields = '__all__'

class DUTProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DUTHandler
        fields = ['name','wanip','platform']

class DeviceProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceHandler
        fields = ['name','wanip','platform']

class DeviceMapperSerializer(serializers.ModelSerializer):
    dut_id = DUTProfileSerializer()
    clientslist = DeviceProfileSerializer(many=True)
    clientIdlist = ClientTypeSerializer(many=True)

    class Meta:
        model = DeviceMapper
        fields = '__all__'

    def to_representation(self, instance):
        return super().to_representation(instance)
    
class SetDeviceMapperSerializer(serializers.ModelSerializer):
    dut_id = serializers.PrimaryKeyRelatedField(queryset=DUTHandler.objects.all())
    clientslist = serializers.PrimaryKeyRelatedField(queryset=DeviceHandler.objects.all(), many=True)
    clientIdlist = serializers.PrimaryKeyRelatedField(queryset=ClientModel.objects.all(), many=True)

    class Meta:
        model = DeviceMapper
        fields = '__all__'

    def to_representation(self, instance):
        return super().to_representation(instance)