import axiosInstance from '../utils/request';
import axios from 'axios';
import { message } from 'antd';

export async function loginRequest(data: object): Promise<any> {
  return axios
    .post('https://www.gsta.top/v3/api-token-auth/', data)
    .then(res => res.data)
    .catch(() => {
      message.error('请检查账号密码是否正确');
    });
}

// 请求发送手机验证码
export async function sendVerification2Phone(data: object): Promise<any> {
  return axiosInstance.get('/phoneCode/', { params: data });
}
