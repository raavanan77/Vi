import vilib
from parser import yamlParser
import logging
import datetime
import os
from munch import DefaultMunch
from dbhandler import getdeviceDetails #,addTestcase

getDetails = yamlParser(filename='/home/vignesh/Vi/testcases/rdkb/pilot.yaml')
undef = object()
testcase = DefaultMunch(undef,getDetails)

logger = logging.getLogger(__name__)

log_path = f'/var/log/{testcase.deviceName}/{testcase.testcaseName+str(datetime.datetime.now())}/'
try:
    if not os.path.exists(log_path):
        os.makedirs(log_path)
except:
    pass    


logging.basicConfig(filename=f'{log_path}/server.log', encoding='utf-8', level=logging.DEBUG)

temp_vars = {}

def dyno_vars(key,value):
    #create variables to use in between the test steps
    temp_vars[key] = value
    logger.info(temp_vars)


def main():
    for test in testcase.testStep:
        func = getattr(vilib,testcase.testStep[test]['method'])
        try:
            device = testcase.testStep[test]['param'][0]
            device = getdeviceDetails(device)
            testcase.testStep[test]['param'][0] = device[1]
        except:
            pass
        result = func(*testcase.testStep[test]['param'])
        logger.info(f"{testcase.testStep[test]['description']} : {result}")
        try:
            if testcase.testStep[test]['savevar']:
                dyno_vars(testcase.testStep[test]['savevar'],result)
        except:
            pass

if __name__ == '__main__':
    main()