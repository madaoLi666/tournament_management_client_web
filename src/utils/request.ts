import axios from 'axios';

const BASE_URL:string = '';
const TIMEOUT:number = 1000;

let axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {}
});

//
axiosInstance.interceptors.request.use((config:object):object => {
  return config;
});

//
axiosInstance.interceptors.response.use((response:any):any => {
  return response;
});

export default axiosInstance;
