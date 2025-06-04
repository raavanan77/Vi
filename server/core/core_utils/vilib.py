import serial
import requests
from time import sleep
import re
import paramiko
from munch import Munch
from ..models import BaseDevice, DeviceMapper, TestcaseResult


class DUT:

    def __init__(self,dutdevice,serial_timeout=1.5,serial_baudrate=115200):
        print(dutdevice)
        dutdevice = Munch(dutdevice)
        self.name = dutdevice.devicename
        self.wan_ip = dutdevice.wanip
        self.ssh_user = dutdevice.username
        self.ssh_password = dutdevice.password
        self.ssh_port = dutdevice.sshport
        self.waniface = dutdevice.waniface
        self.serial_port = dutdevice.serial
        self.serial_baudrate = dutdevice.baudrate if dutdevice.baudrate else serial_baudrate
        self.serial_timeout = serial_timeout
        print("Done")


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
            ssh.connect(hostname=self.wan_ip,port=self.ssh_port,username=self.ssh_user,password=self.ssh_password)
            output = ''
            stdin, stdout, stderr = ssh.exec_command(DUT_command)
            if stdout:
                for i in stdout:
                    output += i
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
        response = self.execute_serial_command(command) if self.serial_port else self.execute_ssh_command(command) 
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
        self.name = client.name
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
    

def get_device_by_id(device_id: str) -> BaseDevice:
    """
    Retrieves a device by its ID from the database.

    Args:
        device_id (str): The ID of the device to retrieve.

    Returns:
        BaseDevice: The device object if found, otherwise None.
    """
    try:
        return BaseDevice.objects.get(id=device_id)
    except BaseDevice.DoesNotExist:
        return None
    except Exception as e:
        print(f"Error retrieving device with ID {device_id}: {e}")
        return None

def get_dut_profile_by_id(profile_id: str) -> DeviceMapper:
    """
    Retrieves a DUT profile by its ID from the database.

    Args:
        profile_id (str): The ID of the DUT profile to retrieve.

    Returns:
        DeviceMapper: The DUT profile object if found, otherwise None.
    """
    try:
        return DeviceMapper.objects.get(id=profile_id)
    except DeviceMapper.DoesNotExist:
        return None
    except Exception as e:
        print(f"Error retrieving DUT profile with ID {profile_id}: {e}")
        return None
    
def create_testcase_result(testcase_data: dict) -> TestcaseResult:
    """
    Creates a new TestcaseResult object in the database.

    Args:
        testcase_data (dict): A dictionary containing the data for the testcase.

    Returns:
        TestcaseResult: The created TestcaseResult object.
    """
    try:
        testcase = TestcaseResult.objects.create(**testcase_data)
        print(f"Testcase result created: {[x for x in testcase_data.items()]}")  # Log created testcase data
        return testcase
    except Exception as e:
        print(f"Error creating testcase result: {e}")
        return None