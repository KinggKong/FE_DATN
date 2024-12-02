import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); 
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error) 
);

axiosClient.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Token might be expired.");
 
      window.location.href = "/auth/login"; 
    }
    return Promise.reject(error); 
  }
);

export default axiosClient;
