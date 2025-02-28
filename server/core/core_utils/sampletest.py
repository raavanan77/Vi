from vilib import DUT
import munch

# below variable will be send as json or object
dutdata = {
    "devicename": "OpenWRT-VM",
    "isclient": False,
    "hostname": "root",
    "password": "root",
    "serial": "",
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

dut = DUT(undefined)

# global testcase variable
netmask = "255.0.0.0"

if dut:
    print(f"Step 1: Setting Netmask to {netmask}")
    dut.execute_ssh_command(f"uci set network.loopback.netmask=\'{netmask}\'")
    print("Restarting Network to apply changes")
    dut.execute_ssh_command("/etc/init.d/nework restart")

    status = dut.exesleep(10)
    if status == 'OK':
        print("Step 1: SUCCESS")
        print("Step 2: Verify the new netmask address")
        status = dut.get_and_verify("uci get network.loopback.netmask","contains",netmask)
        if status == "Pass":
            print("Step 2: Netmask verified Successfully")
        else:
            print("Step 2: Failed netmask value not changed")
