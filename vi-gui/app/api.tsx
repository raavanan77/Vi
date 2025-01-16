
let DJANGO_SERVER_URL = process.env.DJANGO_SERVER_URL;
let DJANGO_SERVER_PORT = process.env.DJANGO_SERVER_PORT;


const fetchTestcase = async (params: string): Promise<any> => {
  try {
    const response = await fetch(
      `http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/fetch/${params}?format=json`,
    );
    if (!response.ok) {
      throw new Error("No response");
    }
    const result = await response.json();
    if (Array.isArray(result)) {
        return result
      } else {
        return []
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

const addorupdateDevice = async (data: any, device: any): Promise<any> => {
  const url = device
      ? `http://localhost:8000/api/device/edit/${device.devicename}`
      : `http://localhost:8000/api/device/add/`;

    const method = device ? "PUT" : "POST"; // PUT for update, POST for add
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response;
};

const getTestcase = async (params: string): Promise<any> => {
  const response = await fetch(
    `http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/editor/${params}?format=json`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
  );
  
  return response;
};

const editTestcase = async (data: any, param: any, isEditMode: Boolean): Promise<any> => {
  const endpoint = isEditMode
      ? `http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/editor/${param}/`
      : `http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/add/`;
    const method = isEditMode ? 'PUT' : 'POST';
  
    const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

const deleteTestcase = async (data: any, param: any,): Promise<any> => {
    const method = 'DELETE';
    const response = await fetch(`http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/editor/${param}/`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.ok;
};

const fetchallTestcase = async (): Promise<any> => {
  try {
    const response = await fetch(`http://${DJANGO_SERVER_URL}:${DJANGO_SERVER_PORT}/api/testcase/get/?format=json`,);
    if (!response.ok) {
      throw new Error("No response");
    }
    const result = await response.json();
    if (Array.isArray(result)) {
        return result
    } 
    else {
      return []
    }
  }
  catch (err) { 
    console.error("Failed to fetch data:", err);
  }
};

export {fetchTestcase,addorupdateDevice,getTestcase,editTestcase,deleteTestcase,fetchallTestcase};