"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('testcase/get/',views.getTestCase,name='getAllTestcase'),
    path('testcase/editor/<str:tcname>/',views.TestcaseEditor,name='testcasebuilder'),
    path('testcase/fetch/<str:tcname>/',views.gettestcaseNames,name='gettestcaseName'),
    path('testcase/execute/',views.executeTestcase,name='execute'),
    path('testcase/add/',views.createTestcase,name='createTestcase'),
    path('device/add/<str:devtype>/',views.addDevice,name='Add_Device'),
    path('device/edit/<str:devtype>/<str:devname>/',views.editDevice,name='Edit_Device'),
    path('device/get/<str:devtype>/',views.getDevice,name='Get_Device'),
    path('device/client/type/',views.addclienttype,name='Add_clienttype')
]
