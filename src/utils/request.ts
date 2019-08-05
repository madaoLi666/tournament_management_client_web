import axios,{ AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL:string = 'https://www.gsta.top/';
const TIMEOUT:number = 1000;

let axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {}
});

axiosInstance.interceptors.request.use((config:AxiosRequestConfig):AxiosRequestConfig => {
  const { method, data } = config;
  let { url } = config;
  // 对get方法的数据进行拼接
  if(method === 'get'){
    if(data && Object.keys(data).length !== 0){
      url += '?';
      for(let key in data){
        if(data.hasOwnProperty(key)){
          url += `${key}=${data[key]}&`;
        }
      }
      // @ts-ignore
      config.url = url.slice(0,-1);
    }
  }
  return config;
});

axiosInstance.interceptors.response.use((response:AxiosResponse):any => {
  // 对response的状况进行修改

  return response.data;
});

export default axiosInstance;
