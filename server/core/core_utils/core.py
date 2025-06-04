import xml.etree.ElementTree as ET
import configparser
import queue
from .testcaseexecutor import TestcaseExecutor
import logging
import asyncio

# Queueing jobs
bee = queue.Queue()

logger = logging.getLogger(__name__)

try:
    # Config reader
    config = configparser.ConfigParser()
    config.read('settings.conf')
except Exception as e:
    raise e

async def main():
    pass

async def testcase_queueing(testcase):
    """Queues the test case for execution"""
    bee.put(testcase)
    print(f"Queuing test case: {testcase}")
    logger.info(f"Test case {testcase} queued for execution.")
    await asyncio.create_task(testcase_dequeueing())

async def testcase_dequeueing():
    """Dequeues the test case for execution"""
    while not bee.empty():
        testcase = bee.get()
        if testcase:
            print(f"Dequeuing test case: {testcase}")
            #TestcaseExecutor(testcase['filename'], testcase['dut']).testcase_executor_with_args(*testcase['args'])
        logger.info(f"Test case {testcase} dequeued for execution.")
    
        bee.task_done()

if __name__ == "__main__":
    asyncio.run(main())
    # Uncomment below line to test the queueing functionality
    # testcase_queueing({'filename': 'sample_test.py', 'dut': 'DUT1', 'args': ['arg1', 'arg2']})