import psycopg2
import configparser

config = configparser.ConfigParser()
config.read('settings.conf')

def connectdb():
    try:
        return psycopg2.connect(database=config['DATABASE']['DBNAME'],host=config['DATABASE']['DBHOST'],user=config['DATABASE']['DBUSER'],password=config['DATABASE']['DBPASSWD'],port=config['DATABASE']['DBPORT'])
    except Exception as e:
        return e

def dbquery(query,method):
    try:
        db = connectdb()
        connection = db.cursor()
        connection.execute(query)
        if method == 'POST':
            db.commit()
            return 'OK'
        else:
            return connection.fetchall()[0]
    except Exception as e:
        return e

def addDevice(deviceName,rpcip,rpcport,extraprop=None):
    try:
        result = dbquery(f'''INSERT INTO devicelist (name,RPCIP,RPCPORT,url,extraprop) VALUES ('{deviceName}','{rpcip}',{rpcport},'{extraprop}');''','POST')
        if result == 'OK':
            return 'OK'
        else:
            return '!OK'
    except Exception as e:
        return e

def getdeviceDetails(deviceName):
    try:
        return dbquery(f'''SELECT * FROM devicelist WHERE name = '{deviceName}';''','GET')
    except Exception as e:
        return e

def editDetails(deviceName):
    try:
        result = dbquery()
    except Exception as e:
        return e

def getUser(username):
    try:
        return dbquery(f'''SELECT * FROM users WHERE username = '{username}' ;''','GET')
    except Exception as e:
        return e
    
def addUser(email,passwd,username):
    try:
        return dbquery(f'''INSERT INTO users (email,password,username) VALUES('{email}','{passwd}','{username}') ;''','POST')
    except Exception as e:
        return e  
#def addTestcase(testcaseName,testcaseDetails):
#    db = connectdb()
#    try:
#        connection = db.cursor()
#        connection.execute(f'''INSERT INTO testcase (name, testdetails) VALUES('{testcaseName}','{testcaseDetails}'::json)''')
#        db.commit()
#        return 'OK'
#    except Exception as e:
#        return e