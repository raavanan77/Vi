from django.urls import path
from ..api_endpoints.device import getclienttype, getDevice, getdutprofile, addclienttype, addDevice, adddutprofile, editDevice, deleteDUTProfile

urlpatterns = [
    path('device/add/<str:devtype>/',addDevice,name='Add_Device'),
    path('device/edit/<str:devtype>/<str:devname>/',editDevice,name='Edit_Device'),
    path('device/get/<str:devtype>/',getDevice,name='Get_Device'),
    path('device/client/type/',addclienttype,name='Add_clienttype'),
    path('device/client/type/get/',getclienttype,name='Get_clienttype'),
    path('dut/profile/add/',adddutprofile,name='Add_DUTProfile'),
    path('dut/profile/get/',getdutprofile,name='Get_DUTProfile'),
    path('dut/profile/delete/<str:profilename>/',deleteDUTProfile,name='Edit_DUTProfile'),
]
