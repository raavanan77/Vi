import paramiko.server
import serial
import requests
from time import sleep
import re
import os
import paramiko

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
    
def execute_ssh_command(IP,user,password,command,port='22'):
    print("Well shh called")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=IP,port=port,username=user,password=password)
        output = ''
        stdin, stdout, stderr = ssh.exec_command(command)
        if stdout:
            for i in stdout:
                output += i
            print("SSH out:",output)
            return output
        else:
            return stderr
    except paramiko.ssh_exception.SSHException as e: 
        return e

    
def execute_serial_command(port,command):
    if port != None:
        output = ''
        try:
            with serial.Serial(port, 115200, timeout=1.5) as ser:
                #Executing command in DUT
                ser.write(command.encode('utf-8'))
                #ser.reset_output_buffer()
                ser.write(b'\r')
                ser.flush()

                #Reading response from device
                ext = ser.readlines()       #.decode('iso-8859-1').strip()
                output += ''.join([_.decode() for _ in ext])
                ser.close()
            return output
        except serial.SerialException as e:
            return e
        except Exception as e:
            return e
    
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

def exesleep(sec):
    #Holds execution for given time
    sleep(sec)
    return 'OK'

