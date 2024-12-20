import vilib
import sys
from dbhandler import getUser,getdeviceDetails
from parser import yamlParser
import logging
import datetime
import os
from munch import DefaultMunch
import requests
import xml.etree.ElementTree as ET 
import configparser
import threading
import queue
import time

# Queueing jobs
bee = queue.Queue() 
# Config reader
config = configparser.ConfigParser()
config.read('settings.conf')
#Temp vars function
temp_vars = {}
#Declaring Threads
threads = []

testcase_path = 'testcases/'
def dyno_vars(key,value):
    #create variables to use in between the test steps
    temp_vars[key] = value

def logAgent(path,testcase):
    logger = logging.getLogger(__name__)
    try:
        if testsuite == False:
            log_path = f'/var/log/vi/{testcase.deviceName}/{testcase.testcaseName+str(datetime.datetime.now())}/'
            if not os.path.exists(log_path):
                os.makedirs(log_path)
                logging.basicConfig(filename=f'{log_path}/server.log', encoding='utf-8', level=logging.DEBUG)
        else:
            log_path = f'/var/log/vi/{testcase.deviceName}/{testcase.testcaseName+str(datetime.datetime.now())}/'
            if not os.path.exists(log_path):
                os.makedirs(log_path)
                logging.basicConfig(filename=f'{log_path}/server.log', encoding='utf-8', level=logging.DEBUG)
    except logger.exception as e:
        return e
    return logger

#Test case Executor
def executor(testfilename,testsuite=False):
    getDetails = yamlParser(filename=testfilename)
    undef = object()
    testcase = DefaultMunch(undef,getDetails)
    logger = logAgent(testcase=testcase)
    for test in testcase.testStep:
        func = getattr(vilib,testcase.testStep[test]['method'])
        try:
            device = testcase.testStep[test]['param'][0]
            device = getdeviceDetails(deviceName=device)
            testcase.testStep[test]['param'][0] = device[3]
        except Exception as e:
            print(e)
        result = func(*testcase.testStep[test]['param'])
        logger.info(f"{testcase.testStep[test]['description']} : {result}")
        try:
            if testcase.testStep[test]['savevar']:
                dyno_vars(testcase.testStep[test]['savevar'],result)
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

#Worker get jobs from bee then execute it
def worker():
    while True:
        worker_bee = bee.get()
        print("Printer: ",worker_bee)
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
def add_work(work_type,filename):
    if work_type == 'testsuite':
        bee.put((work_type,{"xml":filename}))
    else:
        bee.put((work_type,{"testfilename":filename}))
