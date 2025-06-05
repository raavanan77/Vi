from django.urls import path
from ..api_endpoints.testcase import getTestCase, gettestcaseNames, TestcaseEditor, executeTestcase, createTestcase

urlpatterns = [
    path('testcase/get/',getTestCase,name='getAllTestcase'),
    path('testcase/editor/<str:tcname>/',TestcaseEditor,name='testcasebuilder'),
    path('testcase/fetch/<str:tcname>/',gettestcaseNames,name='gettestcaseName'),
    path('testcase/execute/',executeTestcase,name='execute'),
    path('testcase/add/',createTestcase,name='createTestcase')
]
