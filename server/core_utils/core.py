from core_utils import vilib
import logging
import datetime
import os
import xml.etree.ElementTree as ET
import configparser
from munch import DefaultMunch
import threading
import queue
from api.models import DeviceHandler,TestcaseHandler
from api.serializer import DeviceSerializer, TestCaseSerializer

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
    undef = object()
    testcase = DefaultMunch(undef,data)
    testcaseObj = TestcaseHandler.objects.get(testcaseName=testcase.Testcase)
    testDetails = TestCaseSerializer(testcaseObj).data
    DUT = DeviceHandler.objects.get(DeviceName=testcase.Device)
    DUT = DeviceSerializer(DUT).data
    print("DUT: ",DUT)
    ini_worker(3)
    add_work("testcase",testDetails,DUT)
    pass


testcase_path = 'testcases/'
def dyno_vars(key,value):
    #create variables to use in between the test steps
    temp_vars[key] = value

def logAgent(testcase):
    logger = logging.getLogger(__name__)
    try:
        if testsuite == False:
            log_path = f'./logs/{testcase.testPlatform}/{testcase.testcaseName+str(datetime.datetime.now())}/'
            if not os.path.exists(log_path):
                os.makedirs(log_path)
                logging.basicConfig(filename=f'{log_path}/server.log', encoding='utf-8', level=logging.DEBUG)
        else:
            log_path = f'./logs/{testcase.testPlatform}/{testcase.testcaseName+str(datetime.datetime.now())}/'
            if not os.path.exists(log_path):
                os.makedirs(log_path)
                logging.basicConfig(filename=f'{log_path}/server.log', encoding='utf-8', level=logging.DEBUG)
    except logger.exception as e:
        return e
    return logger

#Test case Executor
def executor(testcase,DUT,testsuite=False):
    undef = object()
    testcase = DefaultMunch(undef,testcase)
    DUT = DefaultMunch(undef,DUT)
    print("Exec Called")
    logger = logAgent(testcase=testcase)
    for test in testcase.testcaseDetails:
        func = getattr(vilib,testcase.testcaseDetails[test]['method'])
        try:
            current_device = testcase.testcaseDetails[test]['param'][0]
            if current_device == 'DUT':
                device = DUT
                if "ssh" in func.__name__:
                    testcase.testcaseDetails[test]['param'] = [device.WanIp,device.hostname,device.password,testcase.testcaseDetails[test]['param'][1]]
                    print(testcase.testcaseDetails[test]['param'])
                else:
                    device = DUT.WanIp
            
            #testcase.testcaseDetails[test]['param'][0] = device[3]
        except Exception as e:
            print(e)
        result = func(*testcase.testcaseDetails[test]['param'])
        logger.info(f"{testcase.testcaseDetails[test]['description']} : {result}")
        try:
            if testcase.testcaseDetails[test]['savevar']:
                dyno_vars(testcase.testcaseDetails[test]['savevar'],result)
        except:
            pass
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
