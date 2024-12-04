import serial
import paramiko
import requests

def requestjson(url,method,param : list) -> list:
    # Send Json request to given client and returns output
    print(type(param))
    payload = {
        "method": method,
        "params": param,
        "jsonrpc": "2.0",
        "id": 0,
    }
    response = requests.post(url, json=payload).json()
    return (response['result'])

def createSSHClient(server, port, user,password):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(server, port, user, password)
    return client
    
def vssh(IP,user,password,command):
    if IP != None:
        #Executes given command in device via ssh
        try:
            ssh = createSSHClient(IP,user,password,port="22")
        except:
            print("SSH connection failed")
        stdin,stdout,stderr = ssh.exec_command(command)
        ssh.close()
        return stdin,stdout.readlines(),stderr
    
def execute_serial_command(port,command):
    if port != None:
        print("serial")
        # Open serial port
        output = ''
        ser = serial.Serial(port, 115200, timeout=1)
        #Executing command in DUT
        ser.write(command.encode('utf-8'))
        ser.write(b'\r')
        ext = ser.readlines()#.decode('iso-8859-1').strip()
        for _ in ext:
            output += _.decode().strip('\n')
        ser.close()
        return ext
    
def get_and_verify(method,port,command,value):
    response = execute_serial_command(port,command)
    if method == "contains" and value in response:
        return "Pass"
    elif method == "equals" and value == response:
        return "Pass"

def execute_multiple_command(port,command : list) -> list:
    for cmd in command:
        execute_serial_command(port,cmd)

def set_and_verify_multiple_cmds(port,command: list) -> list:
    for cmd in command:
        execute_serial_command(port,cmd)