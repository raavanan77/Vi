import paramiko
import paramiko.ssh_exception

def execute_ssh_command(IP,user,password,command,port='22'):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=IP,port=port,username=user,password=password)
        output = ''
        stdin, stdout, stderr = ssh.exec_command(command)
        if stdout:
            for i in stdout:
                output += i
            return output
        else:
            return stderr
    except paramiko.ssh_exception.SSHException as e: 
        return e

print(execute_ssh_command('localhost','raavanan','7733','ping -c 1 1.1.1.1'))