// eslint-disable-next-line no-unused-vars
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import router from 'umi/router';
import { isIllegal } from '@/utils/judge';

const BASE_URL: string = 'https://www.gsta.top/v3';
// const BASE_URL: string = 'http://193.112.14.24/v3';
const TIMEOUT: number = 6000;

let axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {},
  validateStatus: (status: number): boolean => {
    if (status === 401) {
      message.warning('登录过期，请重新登录账号');
      window.localStorage.clear();
      router.push('/login');
      return false;
    }
    if (status < 200 || status > 301) {
      message.error('请求失败');
      return false;
    }
    return true;
  },
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const { method, data } = config;
    let { url } = config;
    if (url === undefined || url === null) {
      message.error('[request]url is undefined!');
      return config;
    }
    if (method === 'get') {
      if (data && Object.keys(data).length !== 0) {
        url += '?';
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            url += `${key}=${data[key]}&`;
          }
        }
        config.url = url.slice(0, -1);
      }
    }
    // 检查header中是否有Authorization的key,为config赋值
    config.headers.Authorization =
      window.localStorage.getItem('TOKEN') === null
        ? ''
        : `jwt ${window.localStorage.getItem('TOKEN')}`;
    return config;
  },
);

axiosInstance.interceptors.response.use((response: AxiosResponse): any => {
  // 对response的状况进行修改
  const { data } = response;
  // 判断data中是否有值
  if (!isIllegal(1, data, 'notice') && !isIllegal(1, data, 'error')) {
    return data.data;
  } else if (isIllegal(0, data.error)) {
    message.error(JSON.stringify(data.error));
  } else if (isIllegal(0, data.notice)) {
    message.error(JSON.stringify(data.notice));
  }
  return false;
});

export default axiosInstance;
