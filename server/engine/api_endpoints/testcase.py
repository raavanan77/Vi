from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..core.core import testcase_queueing
from ..models import TestcaseHandler
from ..serializers.testcase import TestCaseSerializer

@api_view(['GET'])
def getTestCase(request):
    try:
        testcase = TestcaseHandler.objects.all()
        casename = TestCaseSerializer(testcase, many=True)
        return Response(casename.data)
    except TestcaseHandler.DoesNotExist:
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
    except TestcaseHandler.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serialzer = TestCaseSerializer(testcase)
        return Response(serialzer.data)
    elif request.method == 'PUT':
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
    except TestcaseHandler.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def executeTestcase(request):
    try:
        if request.method == 'POST':
            testcase_queueing(testcase=request.data)
            return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
