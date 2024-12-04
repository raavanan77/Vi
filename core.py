import arklib
from parser import yamlParser

def main():
    getDetails = yamlParser()
    func = getattr(arklib,getDetails['testStep']['step1']['method'])
    print(func(*getDetails['testStep']['step1']['param']))
    pass

main()