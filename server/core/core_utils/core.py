import core.core_utils.vilib as vilib
import logging
import datetime
import os
import xml.etree.ElementTree as ET
import configparser
from munch import Munch
import threading
import queue
from core.models import TestcaseHandler,DeviceMapper, DUTHandler
from ..api.serializer import TestCaseSerializer, DeviceMapperSerializer, DutSerializer

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
    data = Munch(data)
    testcaseObj = TestcaseHandler.objects.get(testcasename=data.Testcase)
    profile = DeviceMapper.objects.get(profilename=data.profile)
    testcaseObj = TestCaseSerializer(testcaseObj)
    profile = DeviceMapperSerializer(profile)
    ini_worker(3)
    add_work("testcase",testcaseObj,profile)

testcase_path = 'testcases/'

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
    testcase = Munch(testcase.data)

    DUT = DUTHandler.objects.get(name=DUT.data['dut_id']['name'])
    DUT = DutSerializer(DUT)
    DUTobj = vilib.DUT(DUT.data)
    #logger = logAgent(testcase=testcase)
    for test in testcase.testcasedetails:
        step = testcase.testcasedetails[test]
        func_param = step['param']
        func = getattr(DUTobj,step['method'])
        #func()
        print(func.__name__,func_param)
        try:
            result = func(func_param)
            print("Result :",result)
        except Exception as e:
            print("Exception :",e)
        #logger.info(f"{step['description']} : {result}")
        try:
            if step['savevar']:
                pass    #dyno_vars(step['savevar'],result)
        except:
            pass #print("No variable to save")
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
def add_work(work_type,testcase,profile):
    if work_type == 'testsuite':
        bee.put((work_type,{"xml":testcase}))
    else:
        bee.put((work_type,{"testcase":testcase,"DUT":profile}))
