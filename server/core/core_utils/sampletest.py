from vilib import ViLibMain
import munch

dutdata = {
    "devicename": "OpenWRT-VM",
    "isclient": False,
    "hostname": "root",
    "password": "root",
    "serial": "/dev/ttyUSB0",
    "baudrate": "",
    "wanip": "192.168.56.3",
    "sshport": 22,
    "deviceplatform": "Openwrt",
    "lanIface": "",
    "waniface": "eth0",
    "wlanIface": "",
    "extaprops": {}
}

undefined = munch.Munch(dutdata)

DUT = ViLibMain(undefined)

print(DUT.execute_ssh_command("ifconfig"))