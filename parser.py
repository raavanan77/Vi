import yaml
import json

def yamlParser(filename="pilot.yaml"):
    with open(filename) as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            return exc

