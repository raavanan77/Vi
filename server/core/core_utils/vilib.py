import paramiko.server
import serial
import requests
from time import sleep
import re
import threading
import paramiko

class DUT:

    def __init__(self,dutdevice,serial_timeout=1.5,serial_baudrate=115200):
        self.ssh_ip = dutdevice.wanip
        self.ssh_user = dutdevice.hostname
        self.ssh_password = dutdevice.password
        self.ssh_port = dutdevice.sshport
        self.waniface = dutdevice.waniface
        self.serial_port = dutdevice.serial
        self.serial_baudrate = dutdevice.baudrate if dutdevice.baudrate else serial_baudrate
        self.serial_timeout = serial_timeout


    def regex_prompt(prompt_text):
        if '#' in prompt_text:
            pattern = pattern = re.compile(r"^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+:.*[#]", re.IGNORECASE)
        elif '$' in prompt_text:
            pattern = re.compile(r"^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+:.*[$]", re.IGNORECASE)
        return pattern.match(prompt_text)

    def execute_ssh_command(self,DUT_command):
        try:
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(hostname=self.ssh_ip,port=self.ssh_port,username=self.ssh_user,password=self.ssh_password)
            output = ''
            stdin, stdout, stderr = ssh.exec_command(DUT_command)
            if stdout:
                for i in stdout:
                    output += i
                print("SSH out:",output)
                return output
            else:
                return stderr
        except paramiko.ssh_exception.SSHException as e: 
            return e


    def execute_serial_command(self,DUT_command):
        if self.serial_port != None:
            output = ''
            try:
                with serial.Serial(self.serial_port, self.serial_baudrate, timeout=self.serial_timeout) as ser:
                    #Executing command in DUT
                    ser.write(DUT_command.encode('utf-8'))
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

    def get_and_verify(self,command,validate_method,validate_value):
        response = self.execute_serial_command(self.serial_port,command)
        response= response.strip(command)
        if validate_method == "contains" and validate_value in response:
            return "Pass"
        elif validate_method == "equals" and validate_value == response:
            return "Pass"
        else:
            return "Fail"

    def execute_multiple_command(self,command: list) -> list:
        for cmd in command:
            self.execute_serial_command(self.serial_port,cmd)
            sleep(2)

    def exesleep(self,sleep_time):
        #Holds execution for given time
        sleep(sleep_time)
        return 'OK'

class Client:

    def __init__(self,client):
        self.url = client.url
        self.method = client.method
        self.param = client.param

    def execute_client_cmd(self):
        # Send Json request to given client and returns output
        headers = {'content-type': 'application/json'}
        payload = {
            "method": self.method,
            "params": self.param,
            "jsonrpc": "2.0",
            "id": 0,
        }
        response = requests.post(self.url,headers=headers, json=payload).json()
        return (response['result'])