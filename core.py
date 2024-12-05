import vilib
from parser import yamlParser
import logging
import datetime
import os


getDetails = yamlParser(filename='Open_Source_Regression_11AXGHE20_OPEN_2G.yaml')

logger = logging.getLogger(__name__)

log_path = f'./logs/{getDetails["deviceName"]}/{getDetails["testcaseName"]+str(datetime.datetime.now())}/'
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
    for test in getDetails['testStep']:
        func = getattr(vilib,getDetails['testStep'][test]['method'])
        result = func(*getDetails['testStep'][test]['param'])
        logger.info(f"{getDetails['testStep'][test]['description']} : {result}")
        try:
            if getDetails['testStep'][test]['savevar']:
                dyno_vars(getDetails['testStep'][test]['savevar'],result)
        except:
            pass

main()
