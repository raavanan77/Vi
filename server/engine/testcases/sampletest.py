import munch
from ..core.vilib import DUT, Client

# Create a object of DUT class
dutobj = DUT()

# Create a object of Client class

clients = dict()

for i in range(1, 4):
    client = Client(f"Client-{i}")
    clients[client.name] = client

# global testcase variable
netmask = "255.0.0.0"

if dutobj:
    print(f"Step 1: Setting Netmask to {netmask}")
    dutobj.execute_ssh_command(f"uci set network.loopback.netmask=\'{netmask}\'")
    print("Restarting Network to apply changes")
    dutobj.execute_ssh_command("/etc/init.d/nework restart")

    status = dutobj.exesleep(10)
    if status == 'OK':
        print("Step 1: SUCCESS")
        print("Step 2: Verify the new netmask address")
        status = dutobj.get_and_verify("uci get network.loopback.netmask","contains",netmask)
        if status == "Pass":
            print("Step 2: Netmask verified Successfully")
        else:
            print("Step 2: Failed netmask value not changed")
