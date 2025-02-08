from django.db import models

class TestcaseHandler(models.Model):
    testcasename = models.CharField(max_length=200,unique=True)
    testplatform = models.CharField(max_length=30)
    testarea = models.CharField(max_length=200)
    isstandalone = models.BooleanField(default=False)
    description = models.TextField(default='No Description')
    priority = models.CharField(max_length=20,default='P0')
    testcasedetails = models.JSONField()
    
class TestSuiteHandler(models.Model):
    testsuitename = models.CharField(max_length=200,unique=True)
    testsuiteplatform = models.CharField(max_length=30)
    testcaselist = models.JSONField()

class DUTHandler(models.Model):
    dutname = models.CharField(max_length=200,unique=True)
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=200,blank=True,null=True)
    serial = models.CharField(max_length=50,blank=True,null=True)
    baudrate = models.IntegerField(blank=True,null=True)
    wanip = models.CharField(max_length=200)
    waniface = models.CharField(max_length=20,blank=True,null=True)         # Wan interface name Ex: eth0, eth1, etc...
    sshport = models.IntegerField(default=22,blank=True,null=True)          #SSH IP = wanip, SSH Port = sshport, SSH User = hostname, SSH Password = password
    dutplatform = models.CharField(max_length=20)
    extaprops = models.JSONField(blank=True,null=True)

class DeviceHandler(models.Model):
    devicename = models.CharField(max_length=200,unique=True)               # Name of the Device.
    username = models.CharField(max_length=200)                             # Hostname of the device.
    password = models.CharField(max_length=200,blank=True,null=True)        # Password of the device.
    wanip = models.CharField(max_length=200)                                # Wan IP address of the device, Note: Client Agent will listen listen for commands from Server with this WAN IP.
    rpcport = models.IntegerField(default=7777,blank=True,null=True)        # Port for client agent to listen for commands from server.
    rpcurl = models.URLField(max_length=200,blank=True,null=True)           # Don't worry it'll be autosaved with WAN IP and RPC Port.
    sshport = models.IntegerField(default=22,blank=True,null=True)          # Well, just a ssh port
    deviceplatform = models.CharField(max_length=20)                        # Operating System of the Device. For Ex: Linux, OpenWRT, RDKB, etc...
    laniface = models.CharField(max_length=20,blank=True,null=True)         # Lan interface name
    waniface = models.CharField(max_length=20,blank=True,null=True)         # Wan interface name
    wlaniface = models.CharField(max_length=20,blank=True,null=True)        # Wlan interface name
    extaprops = models.JSONField(blank=True,null=True)                      # Extra properties that you wanna add, then call it in test script.

    #Saves RPC URL for Clients
    def save(self ,*args, **kwargs):
        if self.wanip:
            self.rpcurl = f"http://{self.wanip}:{self.rpcport}/jsonrpc" 
        else:
            self.rpcurl = ''

        super(DeviceHandler, self).save(*args,**kwargs)

class ClientType(models.Model):
    name = models.CharField(max_length=100,unique=True)

class DeviceMapper(models.Model):
    profilename = models.CharField(max_length=100,unique=True)
    dut_id = models.ForeignKey(DUTHandler,on_delete=models.CASCADE)
    clientslist = models.ManyToManyField(DeviceHandler, related_name='mapped_clients')
    clientIdlist = models.ManyToManyField(ClientType, related_name='client_type')


    