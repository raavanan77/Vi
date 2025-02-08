import core.core_utils.vilib as vilib
import logging
import datetime
import os
import xml.etree.ElementTree as ET
import configparser
from munch import Munch
import threading
import queue
from core.models import DeviceHandler,TestcaseHandler
from ..api.serializer import DeviceSerializer, TestCaseSerializer

# Queueing jobs
bee = queue.Queue()
# Config reader
config = configparser.ConfigParser()
config.read('settings.conf')
#Temp vars function
temp_vars = {}
#Device Details

deviceDetails = {}

#Declaring Threads
threads = []


def TestCaseExecutor(data):
    testcase = Munch(data)
    testcaseObj = TestcaseHandler.objects.get(testcasename=testcase.Testcase)
    #testDetails = TestCaseSerializer(testcaseObj).data
    DUT = DeviceHandler.objects.get(devicename=testcase.Device)
    #DUT = DeviceSerializer(DUT).data
    print("Testcase Details",testcaseObj.testcasename)
    print("DUT: ",DeviceSerializer(DUT).data)
    ini_worker(3)
    add_work("testcase",testcaseObj,DUT)
    pass


testcase_path = 'testcases/'
def dyno_vars(key,value):
    #create variables to use in between the test steps
    temp_vars[key] = value

def logAgent(testcase):
    logger = logging.getLogger(__name__)
    try:
        if testsuite == False:
            log_path = f'/opt/vi/logs/{testcase.testplatform}/{testcase.testcasename+str(datetime.datetime.now())}/'
            if not os.path.exists(log_path):
                os.makedirs(log_path)
                logging.basicConfig(filename=f'{log_path}/server.log', encoding='utf-8', level=logging.DEBUG)
        else:
            log_path = f'/opt/vi/logs/{testcase.testplatform}/{testcase.testcasename+str(datetime.datetime.now())}/'
            if not os.path.exists(log_path):
                os.makedirs(log_path)
                logging.basicConfig(filename=f'{log_path}/server.log', encoding='utf-8', level=logging.DEBUG)
    except logger.exception as e:
        return e
    return logger

#Test case Executor
def executor(testcase,DUT,testsuite=False):
    print("Exec Called")
    try:
        DUTobj = vilib.DUT(DUT)
    except Exception as e:
        print(e)
    logger = logAgent(testcase=testcase)
    for test in testcase.testcasedetails:
        
        func_param = testcase.testcasedetails[test]['param']
        func = getattr(DUTobj,testcase.testcasedetails[test]['method'])
        func()
        try:
            target_device = testcase.testcasedetails[test]['target']
            if target_device == 'DUT':
                device = DUT
                if "ssh" in func.__name__:
                    func_param = [device.wanip,device.hostname,device.password,testcase.testcasedetails[test]['param']]
            else:
                device = "http://192.168.0.104:7777/jsonrpc" #DUT.rpcurl
                func_param = [device,"cmd",[testcase.testcasedetails[test]['param']]] #Need some changes here
            
            #testcase.testcasedetails[test]['param'][0] = device[3]
        except Exception as e:
            print(e)
        print(func.__name__,func_param)
        result = func(*func_param)
        print("Result",result)
        #logger.info(f"{testcase.testcasedetails[test]['description']} : {result}")
        try:
            if testcase.testcasedetails[test]['savevar']:
                dyno_vars(testcase.testcasedetails[test]['savevar'],result)
        except:
            print("No variable to save")
    return 'OK'

#Testsuite parser
def testsuite(xml):
    root = ET.parse(xml).getroot()
    platform = [x.text for x in root.findall('./script_group/category')][0].lower()
    for i in root.findall('./script_group/scripts'):
        for _ in i:
            result = executor(testfilename=f'{testcase_path}{platform}/{_.text}.yaml',testsuite=True)


def multiScriptExe(testscripts):
    pass


#Worker get jobs from bee then execute it
def worker():
    while True:
        worker_bee = bee.get()
        if worker_bee is None:
            break
        work_type, args = worker_bee
        try:
            if work_type == 'testcase':
                print("Testcase args",args)
                executor(**args)
            elif work_type == 'testsuite':
                testsuite(**args)
        except Exception as e:
            return e
        finally:
            bee.task_done()

#Initiating threads for concurrent execution
def ini_worker(num_workers):
    for i in range(num_workers):
        t = threading.Thread(target=worker)
        t.start()
        threads.append(t)
    return threads

def stop_worker(threads):
    for _ in threads:
        bee.put(None)
    for t in threads:
        t.join()

#Adding jobs to the queue
def add_work(work_type,testcase,dut):
    if work_type == 'testsuite':
        bee.put((work_type,{"xml":testcase}))
    else:
        print("HELLO")
        bee.put((work_type,{"testcase":testcase,"DUT":dut}))
        print("Work Added")
