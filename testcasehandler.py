from parser import yamlParser,yamlwriter
import json
getDetails = yamlParser(filename='/home/vignesh/Vi/testcases/rdkb/pilot.yaml')

print(getDetails)

print(yamlwriter(getDetails,'co-pilot.yaml'))