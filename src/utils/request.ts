import axios,{ AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { isIllegal } from '@/utils/judge';
import router from 'umi/router';
const BASE_URL:string = 'https://www.gsta.top/v3';
const TIMEOUT:number = 6000;


let axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {  },
  validateStatus:(status: number): boolean => {
    if( status === 401 ) {
      message.error('请重新登陆');
      window.localStorage.clear();
      router.push('/login');
      return false;
    }
    if(status < 200 || status > 301) {
      message.error('请求失败');
      return false;
    }
    return true;
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
  const { data } = response;
  // 判断data中是否有值
  if(!isIllegal(1,data,'notice') && !isIllegal(1,data,'error')) {
    return data.data;
  } else if(isIllegal(0,data.error)) {
    // if(Object.prototype.toString.call(data.error) == "[object String]"){
    //   Object.keys(data.error).forEach(function(key: any){
    //     console.log(key,data.error[key]);
    //   })
    // }
    message.error(data.error);
  } else if(isIllegal(0,data.notice)) {
    message.error(data.notice);
  }
  return false;
});

export default axiosInstance;
