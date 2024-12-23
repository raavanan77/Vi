from django.shortcuts import render
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from core import ini_worker,add_work
from .models import User,TestcaseHandler,DeviceHandler
from .serializer import UserSerializer,TestCaseSerializer

@api_view(['GET'])
def Users(request):
    users = User.objects.all()
    print(users.query)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
# Create your views here.

@api_view(['POST'])
def createUser(request):
    serialze = UserSerializer(data=request.data)
    if serialze.is_valid():
        serialze.save()
        return Response(serialze.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serialze.data, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET','PUT','DELETE'])
def UserDetails(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serialzer = UserSerializer(user)
        return Response(serialzer.data)
    
    elif request.method == 'PUT':
        serialzer = UserSerializer(user, data=request.data)
        if serialzer.is_valid():
            serialzer.save()
        return Response(serialzer.data)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def getTestCase(request,tcname):
    try:
        testcase = TestcaseHandler.objects.get(testcaseName=tcname)
        casename = TestCaseSerializer(testcase)
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
        testcase = TestcaseHandler.objects.get(testcaseName=tcname)
    except TestcaseHandler.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serialzer = TestCaseSerializer(testcase, data=request.data)
        if serialzer.is_valid():
            serialzer.save()
        return Response(serialzer.data)
    
    elif request.method == 'DELETE':
        testcase.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def gettestcaseNames(request,tcname):
    try:
        testcase = TestcaseHandler.objects.filter(testPlatform=tcname)
        casename = TestCaseSerializer(testcase, many=True)
        return Response(casename.data)
    except TestcaseHandler.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def executeTestcase(request):
    worker = ini_worker(3)
    if request.method == 'POST':
        data = request.data['value']
        for i in (data):
            print(i:=i['value'])
            testcase = TestcaseHandler.objects.get(testcaseName=i)
            testcaseDetails = TestCaseSerializer(testcase)
            if worker:
                add_work("testcase",testcaseDetails.data)
    return Response(status=status.HTTP_200_OK)
