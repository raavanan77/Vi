from django.db import models

class TestcaseHandler(models.Model):
    testcaseName = models.CharField(max_length=200)
    testPlatform = models.CharField(max_length=30)
    testArea = models.CharField(max_length=200)
    testcaseDetails = models.JSONField()

class DeviceHandler(models.Model):
    DeviceName = models.CharField(max_length=200)                           # Name of the Device.
    isClient = models.BooleanField(null=True)                               # Is the Deivce, Client ?
    hostname = models.CharField(max_length=200)                             # Hostname of the device.
    password = models.CharField(max_length=200,blank=True,null=True)                             # Password of the device.
    serial = models.CharField(max_length=50,blank=True,null=True)                                # Serial Port of the device. For Ex: '/dev/ttyUSBX'
    WanIp = models.CharField(max_length=200)                                # Wan IP address of the device, Note: Client Agent will listen listen for commands from Server with this WAN IP.
    rpcPort = models.IntegerField(default=7777)                             # Port for client agent to listen for commands from server.
    rpcUrl = models.URLField(max_length=200,blank=True,null=True)           # Don't worry it'll be autosaved with WAN IP and RPC Port.
    sshPort = models.IntegerField(default=22,blank=True,null=True)                               # Well, just a ssh port
    DevicePlatform = models.CharField(max_length=20)                        # Operating System of the Device. For Ex: Linux, OpenWRT, RDKB, etc...
    lanIface = models.CharField(max_length=20,blank=True,null=True)         # Lan interface name
    wanIface = models.CharField(max_length=20,blank=True,null=True)         # Wan interface name
    wlanIface = models.CharField(max_length=20,blank=True,null=True)        # Wlan interface name
    extaprops = models.JSONField(blank=True,null=True)                      # Extra properties that you wanna add, then call it in test script.


    #Saves RPC URL for Clients
    def save(self ,*args, **kwargs):

        if self.isClient:
            self.rpcUrl = f"http://{self.rpcIp}:{self.rpcPort}" 
        else:
            self.rpcUrl = ''

        super(DeviceHandler, self).save(*args,**kwargs)


class TestSuiteHandler(models.Model):
    testSuiteName = models.CharField(max_length=200)
    testSuitePlatform = models.CharField(max_length=30)
    testcaseList = models.JSONField()