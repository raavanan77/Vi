import arklib
from parser import yamlParser

def main():
    getDetails = yamlParser()
    for test in getDetails['testStep']:
        func = getattr(arklib,getDetails['testStep'][test]['method'])
        print(func(*getDetails['testStep'][test]['param']))
    pass

main()