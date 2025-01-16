from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..core_utils.core import TestCaseExecutor
from ..models import TestcaseHandler,DeviceHandler,DUTHandler
from .serializer import TestCaseSerializer,DeviceSerializer,DutSerializer

@api_view(['GET'])
def getTestCase(request):
    try:
        testcase = TestcaseHandler.objects.all()
        print(testcase.query)
        casename = TestCaseSerializer(testcase, many=True)
        return Response(casename.data)
    except TestcaseHandler.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def createTestcase(request):
    if request.method == 'POST':
        serialze = TestCaseSerializer(data=request.data)
    if serialze.is_valid():
        serialze.save()
        return Response(serialze.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serialze.data, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT','GET','DELETE'])
def TestcaseEditor(request,tcname):
    try:
        testcase = TestcaseHandler.objects.get(testcasename=tcname)
    except TestcaseHandler.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serialzer = TestCaseSerializer(testcase)
        return Response(serialzer.data)
    if request.method == 'PUT':
        serialzer = TestCaseSerializer(testcase, data=request.data)
        if serialzer.is_valid():
            serialzer.save()
        return Response(status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        testcase.delete()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def gettestcaseNames(request,tcname):
    try:
        testcase = TestcaseHandler.objects.filter(testplatform=tcname)
        casename = TestCaseSerializer(testcase, many=True)
        return Response(casename.data)
    except TestcaseHandler.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def executeTestcase(request):
    if request.method == 'POST':
        print(request.data)
        TestCaseExecutor(data=request.data)
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def addDevice(request):
    if request.method == 'POST':
        device = DeviceSerializer(data=request.data)
    if device.is_valid():
        device.save()
        return Response(status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','DELETE'])
def editDevice(request,dn):
    device = DeviceHandler.objects.get(devicename=dn)
    if request.method == 'GET':
        device = DeviceSerializer(device)
        return Response(device.data)
    if request.method == 'PUT':
        device = DeviceSerializer(device, data=request.data)
        if device.is_valid():
            device.save()
        return Response(status=status.HTTP_200_OK)
    if request.method == 'DELETE':
        device.delete()
        return Response(status=status.HTTP_200_OK)
    
@api_view(['GET'])
def getDevice(request,name):
    try:
        testcase = DeviceHandler.objects.filter(deviceplatform=name)
        device = DeviceSerializer(testcase, many=True)
        return Response(device.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def getDUTDevice(request):
    data = {}
    try:
        device = DUTHandler.objects.all()
        DUT = DutSerializer(device, many=True)
        return Response(DUT.data)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
 