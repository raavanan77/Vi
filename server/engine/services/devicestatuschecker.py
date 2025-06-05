import sys
import asyncio
from ..models import BaseDevice

async def ping_device(ip):
    ping = await asyncio.create_subprocess_exec(
        'ping','-c 2', ip,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)
    
    stdout, stderr = await ping.communicate()

    return ping.returncode
    

async def check_device_status():
    device = BaseDevice.objects.all()
    print(device)

asyncio.run(check_device_status())