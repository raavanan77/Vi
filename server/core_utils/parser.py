import yaml
import json

def yamlParser(filename):
    with open(filename) as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            return exc

def yamlwriter(testcaseData,filename):
    try:
        file = open(filename,'w')
        yaml.dump(testcaseData,file)
        file.close()
        return "OK"
    except yaml.YAMLError as e:
        return e
    
print(yamlParser("/home/raavanan/vi/server/testcases/rdkb/sanityrdkb.yaml"))