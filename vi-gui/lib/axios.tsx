import axios, { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {    
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const axiosInstance = axios.create(config);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Prevent infinite loop if the refresh token request fails
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `http://localhost:8000/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Logout on refresh failure
        try {
          await axios.post(`http://localhost:8000/auth/logout`, {}, { withCredentials: true });
        } catch (logoutError) {
          console.error("Logout request failed:", logoutError);
        }
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
