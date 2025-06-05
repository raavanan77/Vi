import asyncio

class TestcaseExecutor:
    """Class to execute test cases"""
    
    def __init__(self, filename, dut):
        self.filename = filename
        self.dut = dut

    async def testcase_executor_with_args(self, *args):
        """Executes python script requested by user with arguments"""
        if not self.filename.endswith('.py'):
            raise ValueError("Filename must end with .py extension")

        process = await asyncio.create_subprocess_exec(
            'python3', self.filename, *args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE)

        stdout, stderr = await process.communicate()

        return process.returncode
