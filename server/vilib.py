import serial
import asyncssh
import requests
from time import sleep
import re
import os

def regex_prompt(prompt_text):
    if '#' in prompt_text:
        pattern = pattern = re.compile(r"^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+:.*[#]", re.IGNORECASE)
    elif '$' in prompt_text:
        pattern = re.compile(r"^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+:.*[$]", re.IGNORECASE)
    return pattern.match(prompt_text)

def execute_client_cmd(url,method,param : list) -> list:
    # Send Json request to given client and returns output
    payload = {
        "method": method,
        "params": param,
        "jsonrpc": "2.0",
        "id": 0,
    }
    print(url)
    response = requests.post(url, json=payload).json()
    print(response)
    return (response['result'])
    
async def execute_ssh_command(IP,user,password,command,port='22'):
    try:
        async with asyncssh.connect(host=IP,username=user,password=password,port=port,known_hosts=None) as ssh:
            result = await ssh.run(command)
            if result.stdout:
                return result.stdout
            else:
                return result.stderr
    except asyncssh.Error as e:
        print("SSH connection failed : ",e)

    
def execute_serial_command(port,command):
    if port != None:
        output = ''
        ser = serial.Serial(port, 115200, timeout=1.5)
        #Executing command in DUT
        ser.write(command.encode('utf-8'))
        #ser.reset_output_buffer()
        ser.write(b'\r')
        ext = ser.readlines()       #.decode('iso-8859-1').strip()
        for _ in ext:
            output += _.decode()
        ser.close()
        return output
    
def get_and_verify(method,port,command,value):
    response = execute_serial_command(port,command)
    response= response.strip(command)
    if method == "contains" and value in response:
        return "Pass"
    elif method == "equals" and value == response:
        return "Pass"
    else:
        return "Fail"

def execute_multiple_command(port,command : list) -> list:
    for cmd in command:
        execute_serial_command(port,cmd)
        sleep(2)

def exesleep(time):
    #Holds execution for given time
    sleep(time)
    return 'OK'

def testcasedumper(platform):
    for root, dirs, files in os.walk(f"/home/vignesh/Vi/server/testcases/{platform.lower()}",topdown=True,):
        #for f in files:
        #    f = f.replace('.yaml','')
        files = {"testcases":files}
        return files


#loop = asyncio.get_event_loop()
#print(loop.run_until_complete(execute_ssh_command('172.16.0.172','vignesh','7733','sudo docker ps')))