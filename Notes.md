# sql command
    CREATE ROLE [username] WITH SUPERUSER LOGIN CREATEDB CREATEROLE CREATEUSER;
    ALTER USER [username] WITH PASSWORD '[password]';
    CREATE DATABASE [database_name];
    CREATE TABLE users (id SERIAL PRIMARY KEY,email TEXT NOT NULL UNIQUE,password TEXT NOT NULL,username TEXT NOT NULL UNIQUE);
    CREATE TABLE devicelist(name TEXT, RPCIP TEXT, RPCPORT INT,url TEXT,LAN_iface TEXT,WAN_iface TEXT,WLAN_iface TEXT,extraprop JSONB);
    CREATE TABLE testcase(name TEXT, testDetails JSONB);
    CREATE TABLE users;
    INSERT INTO users(email,password,username) VALUES ('vixxxxxx@outlook.com','3vv!','vi');
    INSERT INTO devicelist (name,RPCIP,RPCPORT,url,LAN_iface TEXT,WAN_iface TEXT,WLAN_iface TEXT,extraprop) VALUES ('LAN_LINUX_CLIENT','0.0.0.0',4001,'http://0.0.0.0:4001/jsonrpc', 'eth1','eth0','wlan0', NULL);

    # DB Backup
    pg_dump vi -U [username] -h localhost -F c -f [Backup_database_name]

# Testsuite
    Fed up by executing one by one

# On PRPL Sanity
    18 Test case

# Nav
<NavProjects projects={data.projects} />

# Error Handler

# Test cases 
    - can be edited with blocks or text editor that comes with web ui

# Label
<Label key={index} onClick={(e) => {
  e.preventDefault();
  onItemClick(testcase.testcaseName);
}}>


# Toaster is broken
