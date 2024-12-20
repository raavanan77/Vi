import subprocess

with subprocess.Popen(['python3','core.py']) as p:
    print(p.stdout)