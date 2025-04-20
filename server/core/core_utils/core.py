import xml.etree.ElementTree as ET
import configparser
import queue
import asyncio
import logging


def TestCaseExecutor():
    pass

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
