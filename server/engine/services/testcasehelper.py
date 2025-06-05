from ..models import BaseDevice, DeviceMapper, TestcaseResult

def get_device_by_id(device_id: str) -> BaseDevice:
    """
    Retrieves a device by its ID from the database.

    Args:
        device_id (str): The ID of the device to retrieve.

    Returns:
        BaseDevice: The device object if found, otherwise None.
    """
    try:
        return BaseDevice.objects.get(id=device_id)
    except BaseDevice.DoesNotExist:
        return None
    except Exception as e:
        print(f"Error retrieving device with ID {device_id}: {e}")
        return None

def get_dut_profile_by_id(profile_id: str) -> DeviceMapper:
    """
    Retrieves a DUT profile by its ID from the database.

    Args:
        profile_id (str): The ID of the DUT profile to retrieve.

    Returns:
        DeviceMapper: The DUT profile object if found, otherwise None.
    """
    try:
        return DeviceMapper.objects.get(id=profile_id)
    except DeviceMapper.DoesNotExist:
        return None
    except Exception as e:
        print(f"Error retrieving DUT profile with ID {profile_id}: {e}")
        return None
    
def create_testcase_result(testcase_data: dict) -> TestcaseResult:
    """
    Creates a new TestcaseResult object in the database.

    Args:
        testcase_data (dict): A dictionary containing the data for the testcase.

    Returns:
        TestcaseResult: The created TestcaseResult object.
    """
    try:
        testcase = TestcaseResult.objects.create(**testcase_data)
        print(f"Testcase result created: {[x for x in testcase_data.items()]}")  # Log created testcase data
        return testcase
    except Exception as e:
        print(f"Error creating testcase result: {e}")
        return None