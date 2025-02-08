
let DJANGO_SERVER_URL = process.env.DJANGO_SERVER_URL;
let DJANGO_SERVER_PORT = process.env.DJANGO_SERVER_PORT;
let API_URL = `http://${process.env.DJANGO_SERVER_URL}:${process.env.DJANGO_SERVER_PORT}`

const fetchTestcase = async (params: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_URL}/api/testcase/fetch/${params}?format=json`,
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

const addorupdateDevice = async (devtype:string,data: any, device: any): Promise<any> => {
  console.log("API Update client:",device)
  const url = device !== "new"
      ? `${API_URL}/api/device/edit/${devtype}/${device}/`
      : `${API_URL}/api/device/add/${devtype}/`;

    const method = device !== "new" ? "PUT" : "POST"; // PUT for update, POST for add
    console.log("Method:",method,data)
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response;
};

const getSingleDevice = async (devtype : string,device: string): Promise<any> => {
  const response = (await fetch(`${API_URL}/api/device/edit/${devtype}/${device}`,{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
  }));
  return response
};

const getTestcase = async (params: string): Promise<any> => {
  const response = await fetch(
    `${API_URL}/api/testcase/editor/${params}?format=json`,{
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
      ? `${API_URL}/api/testcase/editor/${param}/`
      : `${API_URL}/api/testcase/add/`;
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
    const response = await fetch(`${API_URL}/api/testcase/editor/${param}/`, {
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
    const response = await fetch(`${API_URL}/api/testcase/get/?format=json`,);
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

const fetchclientdev = async(devtype : string) : Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/device/get/${devtype}?format=json`,);
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
}

const deletedev = async(data : any, devtype : string, devicename: string) : Promise<any> => {
  try {
      const method = 'DELETE';
      const response = await fetch(`${API_URL}/api/device/edit/${devtype}/${devicename}/?format=json`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  }
  catch(err){
    return "An error occurred"
  }
}

export {fetchTestcase,addorupdateDevice,getTestcase,editTestcase,deleteTestcase,fetchallTestcase,fetchclientdev,getSingleDevice,deletedev};