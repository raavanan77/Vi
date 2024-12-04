import arklib
from parser import yamlParser

def dyno_vars():
    #create variables to use in between the test steps
    
    pass


def main():
    getDetails = yamlParser()
    for test in getDetails['testStep']:
        func = getattr(arklib,getDetails['testStep'][test]['method'])
        print(func(*getDetails['testStep'][test]['param']))
    pass

main()