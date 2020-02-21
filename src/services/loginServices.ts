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

// 获取账号基本信息   返回的status 1表示不是单位账号，2代表单位账号，会附带信息
export async function accountdata(): Promise<any> {
  return axiosInstance.get('/accountdata/');
}

// 获取验证码图片
export async function getVerificationPic(): Promise<any> {
  return axiosInstance.get('/bindCodeApi/');
}

// 校验手机验证码
export async function checkVerificationCode(data: object): Promise<any> {
  return axiosInstance.post('/phoneCode/', data);
}
