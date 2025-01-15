import requests

def requestjson(method,url,param : list) -> list:
    # Send Json request to given client and returns output
    print(type(param))
    payload = {
        "method": method,
        "params": param,
        "jsonrpc": "2.0",
        "id": 0,
    }
    response = requests.post(url, json=payload).json()
    return (response['result'])

print(requestjson("cmd","http://172.16.0.197:4001/jsonrpc",["ls"]))