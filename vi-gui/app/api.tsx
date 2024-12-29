
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

export {fetchTestcase};