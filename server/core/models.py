from django.db import models


class TestcaseRepo(models.Model):
    testcasename = models.CharField(max_length=200, unique=True)
    testplatform = models.CharField(max_length=30)
    testtype = models.CharField(max_length=50)

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

class BaseDevice(models.Model):
    name = models.CharField(max_length=50,unique=True)
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=200,blank=True,null=True)
    status = models.CharField(max_length=15,null=False)
    wanip = models.CharField(max_length=200)
    waniface = models.CharField(max_length=20,blank=True,null=True)         # Wan interface name Ex: eth0, eth1, etc...
    laniface = models.CharField(max_length=20,blank=True,null=True)         # Lan interface name
    sshport = models.IntegerField(default=22,blank=True,null=True)          #SSH IP = wanip, SSH Port = sshport, SSH User = hostname, SSH Password = password
    platform = models.CharField(max_length=20)
    extaprops = models.JSONField(blank=True,null=True)                      # Extra properties that you wanna add, then call it in test script.

class DUTHandler(BaseDevice):
    serial = models.CharField(max_length=50,blank=True,null=True)
    baudrate = models.IntegerField(blank=True,null=True)

class DeviceHandler(BaseDevice):
    rpcport = models.IntegerField(default=7777,blank=True,null=True)        # Port for client agent to listen for commands from server.
    rpcurl = models.URLField(max_length=200,blank=True,null=True)           # Don't worry it'll be autosaved with WAN IP and RPC Port.
    wlaniface = models.CharField(max_length=20,blank=True,null=True)        # Wlan interface name

    #Saves RPC URL for Clients
    def save(self ,*args, **kwargs):
        if self.wanip:
            self.rpcurl = f"http://{self.wanip}:{self.rpcport}/jsonrpc" 
        else:
            self.rpcurl = ''

        super(DeviceHandler, self).save(*args,**kwargs)

class ClientModel(models.Model):
    name = models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.name

class DeviceMapper(models.Model):
    profilename = models.CharField(max_length=100,unique=True)
    dut_id = models.ForeignKey(DUTHandler,on_delete=models.CASCADE)
    clientslist = models.ManyToManyField(DeviceHandler, related_name='mapped_clients')
    clientIdlist = models.ManyToManyField(ClientModel, related_name='client_model')


    