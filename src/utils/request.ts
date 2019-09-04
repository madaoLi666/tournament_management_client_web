import axios,{ AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
const BASE_URL:string = 'https://www.gsta.top/v3';
const TIMEOUT:number = 6000;


let axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {

  }
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
  // 检查header中是否有Authorization的key
  // 为config赋值
  config.headers.Authorization = window.localStorage.getItem('TOKEN') === null ? '' : `jwt ${window.localStorage.getItem('TOKEN')}`;


  return config;
});

axiosInstance.interceptors.response.use((response:AxiosResponse):any => {
  // 对response的状况进行修改
  const { status } = response;
  const { data } = response;
  console.log(status);

  if(status < 200 || status > 301) {
    message.error('请求失败，请检查网络状况');
    return false;
  }
  // 没有权限
  if( status === 401 ) {
    //@ts-ignore
    window.g_app.router.push('/login');
    return false;
  }


  return response.data;
},(error) => {
  console.log(error);
  return false;
});

export default axiosInstance;
