import subprocess
from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple
import logging
from jsonrpc import JSONRPCResponseManager, dispatcher
from time import sleep
import jsonrpc

exe_status = ">> /dev/null && echo \"SUCCESS\" || echo \"FAILURE\""

@dispatcher.add_method
def foobar(**kwargs):
    return kwargs["foo"] + kwargs["bar"]

def execute_command(command):       
    if command:
        # Run the command and get the output
        print(f"Execute Command : {command}")
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        print(f"Output : {result.stdout}")
        return result.stdout.strip('\n')  #.decode('utf-8', errors='ignore')
    else:
        return result.stderr

def refresh_wifinw():
    #Refresh wifi
    wifioff = execute_command(f"nmcli radio wifi off {exe_status}")
    wifion = execute_command(f"nmcli radio wifi on {exe_status}")
    sleep(10)
    isUP = int(execute_command(f"nmcli dev wifi | wc -l"))
    if wifioff == "SUCCESS" and wifion == "SUCCESS" and isUP > 1:
        return "SUCCESS"
    else:
        return "FAILED"
    
def is_ssid_available(ssid):
    #Checks the given SSID is available or not
    output = execute_command(f"nmcli dev wifi | grep {ssid}")
    if ssid in output:
        return output
    else:
        return f"SSID: {ssid} not found"

def connect_to_ssid(ssid,passwd="open"):
    #Connects client to given ssid
    if passwd != "open": #checks the Network's security
        connection = execute_command(f"sudo nmcli dev wifi connect {ssid} password {passwd}")
    else:
        connection = execute_command(f"sudo nmcli dev wifi connect {ssid}")
    
    if "successfully" in connection:
        return "SUCCESS"
    else:
        return "FAILED"

def get_connected_ssid(ssid):
    #Retuns current SSID that client associated to
    awk = "awk \'{print $3}\'"
    ssid = execute_command(f"nmcli dev wifi | grep {ssid} | {awk}")
    return ssid

def disconnect_wifi(iface):
    #Disconnects Wifi association with AP
    result = execute_command(f"sudo nmcli dev disconnect {iface} {exe_status}")
    return result

def get_ipv4addr(iface):
    #Returns IP address of given Interface
    awk = "awk \'{print $2}\'"
    ip = execute_command(f"ifconfig {iface} | grep \'inet \' | {awk}" )
    return ip

def get_subnetmask(iface):
    #Return subnetmask of given Interface
    awk = "awk \'{print $4}\'"
    snmask = execute_command(f"ifconfig {iface} | grep \'netmask \' | {awk}")
    return snmask

def get_macaddr(iface):
    #Returns MAC address of given interface
    mac = execute_command(f"ifconfig {iface} | grep ether | tr -s ' ' | cut -d ' ' -f 3")
    return mac

def get_channelno(iface):
    #Returns Current Channel Number of WIFI
    awk = "awk \'{print $2}\'"
    chno = execute_command(f"iw {iface} info | grep channel | {awk}")    
    if len(chno) > 0:
        return chno
    else:
        return "Wifi is not connected to AP"

def get_bitrate(iface):
    #Return WIFI bitrate 
    awk = "awk \'{print $1}\'"
    bitrate = execute_command(f"iwconfig {iface} | grep \"Bit Rate\" | cut -d \"=\" -f2 | {awk}")
    return bitrate

def get_security_mode(ssid):
    #Return WIFI's security mode
    awk = "awk \'{ print $10 }\'"
    secode = execute_command(f"nmcli device wifi list | grep {ssid} | {awk}")
    if secode in ssid:
        return secode
    else:
        return "SSID not available or Client not connected to SSID"

def bring_interface_down(iface):
    #Bring down given Interface
    idown = execute_command(f"sudo ifconfig {iface} down {exe_status}")
    return idown

def bring_interface_up(iface):
    #Bring up given Interface
    iup = execute_command(f"sudo ifconfig {iface} up {exe_status}")
    return iup

def ping(iface, nwipaddr):
    #pings given IP address from given interface
    response = execute_command(f"ping -I {iface} -c 3 {nwipaddr} {exe_status}")
    return response

def curl(iface,addr):
    #Get given web address from given IP as source 
    httpcode = '%{http_code}\n'
    response = execute_command(f"curl --interface {iface} -o /dev/null --silent --head --write-out \'{httpcode}\' {addr}")
    return response

def delete_saved_wifi_connections(ssid):
    delete = execute_command(f"sudo rm /etc/NetworkManager/system-connections/{ssid} {exe_status}")
    return delete

def refresh_interface(iface):
    if bring_interface_down(iface) == "SUCCESS" and bring_interface_up(iface) == "SUCCESS":
        return "SUCCESS"
    else:
        return "FAILURE"
    

@Request.application
def application(request):
    # Dispatcher is dictionary {<method_name>: callable}
    print(request.data)
    dispatcher["cmd"] = execute_command
    dispatcher["refresh_wifinw"] = refresh_wifinw
    dispatcher["is_ssid_available"] = is_ssid_available
    dispatcher["connect_to_ssid"] = connect_to_ssid
    dispatcher["disconnect_wifi"] = disconnect_wifi
    dispatcher["get_connected_ssid"] = get_connected_ssid
    dispatcher["get_ipv4addr"] = get_ipv4addr
    dispatcher["get_subnetmask"] = get_subnetmask
    dispatcher["get_macaddr"] = get_macaddr
    dispatcher["get_channelno"] = get_channelno
    dispatcher["get_bitrate"] = get_bitrate
    dispatcher["get_security_mode"] = get_security_mode
    dispatcher["bring_interface_down"] = bring_interface_down
    dispatcher["bring_interface_up"] = bring_interface_up
    dispatcher["ping"] = ping
    dispatcher["curl"] = curl

    response = JSONRPCResponseManager.handle(
        request.data, dispatcher)
    return Response(response.json, mimetype='application/json')

if __name__ == '__main__':
    run_simple('0.0.0.0', 7777, application)
