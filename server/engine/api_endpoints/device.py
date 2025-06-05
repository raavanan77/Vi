from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import DeviceHandler,ClientModel,DUTHandler, DeviceMapper
from ..serializers.devices import DeviceSerializer,DutSerializer,ClientTypeSerializer,DeviceMapperSerializer,SetDeviceMapperSerializer

@api_view(['POST'])
def addDevice(request,devtype):
    if request.method == 'POST':
        device = DeviceSerializer(data=request.data) if devtype == 'client' else DutSerializer(data=request.data)
    if device.is_valid():
        device.save()
        return Response(status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','DELETE'])
def editDevice(request,devtype,devname):
    device = DeviceHandler.objects.get(name=devname) if devtype == 'client' else DUTHandler.objects.get(name=devname)
    if request.method == 'GET':
        device = DeviceSerializer(device) if devtype == 'client' else DutSerializer(device)
        return Response(device.data)
    if request.method == 'PUT':
        device = DeviceSerializer(device, data=request.data) if devtype == 'client' else DutSerializer(device, data=request.data)
        if device.is_valid():
            device.save()
        return Response(status=status.HTTP_200_OK)
    if request.method == 'DELETE':
        device.delete()
        return Response(status=status.HTTP_200_OK)
    
@api_view(['GET'])
def getDevice(request,devtype):
    try:
        dev = DeviceHandler.objects.all() if devtype == 'client' else DUTHandler.objects.all()
        device = DeviceSerializer(dev, many=True) if devtype == 'client' else DutSerializer(dev, many=True)
        return Response(device.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def addclienttype(request):
    if request.method == 'POST':
        ctype = ClientTypeSerializer(data=request.data)
        if ctype.is_valid():
            ctype.save()
            return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def getclienttype(request):
    try:
        clist = ClientModel.objects.all()
        client = ClientTypeSerializer(clist, many=True)
        return Response(client.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def adddutprofile(request):
    if request.method == 'POST':
        ctype = SetDeviceMapperSerializer(data=request.data)
        if ctype.is_valid():
            ctype.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
def getdutprofile(request):
    try:
        clist = DeviceMapper.objects.all()
        client = DeviceMapperSerializer(clist, many=True)
        return Response(client.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def deleteDUTProfile(request,profilename):
    try:
        dev = DeviceMapper.objects.get(profilename=profilename)
        dev.delete()
        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)