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
from flask import Flask, request, jsonify

bee = queue.Queue()
config = configparser.ConfigParser()
config.read('settings.conf')

DBURL = config['DATABASE']['API_URL']

temp_vars = {}
testcase_path = 'testcases/'
def dyno_vars(key,value):
    #create variables to use in between the test steps
    temp_vars[key] = value


def executor(testfilename,testsuite=False):
    getDetails = yamlParser(filename=testfilename)
    undef = object()
    testcase = DefaultMunch(undef,getDetails)
    logger = logging.getLogger(__name__)
    try:
        if testsuite == False:
            log_path = f'/var/log/vi/{testcase.deviceName}/{testcase.testcaseName+str(datetime.datetime.now())}/'
            if not os.path.exists(log_path):
                os.makedirs(log_path)
        else:
            log_path = f'/var/log/vi/{testcase.deviceName}/{testcase.testcaseName+str(datetime.datetime.now())}/'
            if not os.path.exists(log_path):
                os.makedirs(log_path)
    except:
        pass    
    logging.basicConfig(filename=f'{log_path}/server.log', encoding='utf-8', level=logging.DEBUG)
    for test in testcase.testStep:
        func = getattr(vilib,testcase.testStep[test]['method'])
        try:
            device = testcase.testStep[test]['param'][0]
            device = getdeviceDetails(deviceName=device)[0]
            print(device)
            testcase.testStep[test]['param'][0] = f''
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

def testsuite(xml):
    root = ET.parse(xml).getroot()
    platform = [x.text for x in root.findall('./script_group/category')][0].lower()
    for i in root.findall('./script_group/scripts'):
        for _ in i:
            result = executor(testfilename=f'{testcase_path}{platform}/{_.text}.yaml',testsuite=True)

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


def ini_worker(num_workers):
    threads = []
    for i in range(num_workers):
        t = threading.Thread(target=executor)
        t.start()
        threads.append(t)
    return threads

def stop_worker(threads):
    for _ in threads:
        bee.put(None)
    for t in threads:
        t.join()

def add_work(work_type,filename):
    if work_type == 'testsuite':
        bee.put(work_type,{"xml":filename})
    else:
         bee.put(work_type,{"testfilename":filename})
 

if __name__ == '__main__':
    pass