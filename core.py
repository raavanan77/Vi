import vilib
from parser import yamlParser

temp_vars = {}

def dyno_vars(key,value):
    #create variables to use in between the test steps
    temp_vars[key] = value
    print(temp_vars)


def main():
    getDetails = yamlParser(filename='firewall_ping.yaml')
    for test in getDetails['testStep']:
        func = getattr(vilib,getDetails['testStep'][test]['method'])
        result = func(*getDetails['testStep'][test]['param'])
        print(getDetails['testStep'][test]['description'],result)
        try:
            if getDetails['testStep'][test]['savevar']:
                dyno_vars(getDetails['testStep'][test]['savevar'],result)
        except:
            pass

main()