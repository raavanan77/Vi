import asyncio
import sys
from core.models import BaseDevice

async def testcase_executor(filename):
    """Executes python script requested by user"""
    process = await asyncio.create_subprocess_exec(
        'python3', filename,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)
    
    stdout, stderr = await process.communicate()

    return process.returncode
