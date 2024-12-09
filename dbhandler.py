import psycopg2

def connectdb():
    try:
        return psycopg2.connect(database="vi",host = "0.0.0.0",user="vignesh",password = "root",port=5432)
    except Exception as e:
        return e

def addDevice(deviceName,rpcip,rpcport,extraprop=None):
    db = connectdb()
    try:
        connection = db.cursor()
        connection.execute(f'''INSERT INTO devicelist (name,RPCIP,RPCPORT,extraprop) VALUES ('{deviceName}','{rpcip}',{rpcport},'{extraprop}');''')
        db.commit()
        return 'OK'
    except Exception as e:
        return e

def getdeviceDetails(deviceName):
    db = connectdb()
    connection = db.cursor()
    connection.execute(f'''SELECT * FROM devicelist WHERE name = '{deviceName}';''')
    result = connection.fetchall()
    return result[0]

def editDetails(deviceName):
    db = connectdb()
    connection = db.cursor()
    connection.execute('''ALTER''')
    db.commit()

def addTestcase(testcaseName,testcaseDetails):
    db = connectdb()
    try:
        connection = db.cursor()
        connection.execute(f'''INSERT INTO testcase (name, testDetails) VALUES('{testcaseName}',{testcaseDetails})''')
        db.commit()
        return 'OK'
    except Exception as e:
        return e