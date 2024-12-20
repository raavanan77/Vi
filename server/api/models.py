from django.db import models

class User(models.Model):
    name = models.CharField(max_length=25)
    email = models.CharField(max_length=50)

class TestcaseHandler(models.Model):
    testcaseName = models.CharField(max_length=200)
    testPlatform = models.CharField(max_length=30)
    testArea = models.CharField(max_length=200)
    testcaseDetails = models.JSONField()

class DeviceHandler(models.Model):
    DeviceName = models.CharField(max_length=200)
    hostname = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    rpcIp = models.CharField(max_length=200)
    rpcPort = models.IntegerField(default=7777)
    rpcUrl = models.CharField(max_length=200)
    sshPort = models.IntegerField(default=21)
    DevicePlatform = models.CharField(max_length=20)
    lanIface = models.CharField(max_length=20)
    wanIface = models.CharField(max_length=20)
    wlanIface = models.CharField(max_length=20)
    extaprops = models.JSONField()