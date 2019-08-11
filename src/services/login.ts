import axiosInstance from '@/utils/request.ts';
import { async } from 'q';

// 接口返回数据格式
export interface Response {
  data: string
  error: string
  notice: string
}

// 请求发送手机验证码
export async function sendVerification2Phone(data: string): Promise<any> {
  return axiosInstance.get('/phoneCode/',{params:{phonenumber: data}});
}

// 获取验证码图片
export async function getVerificationPic(): Promise<any> {
  return axiosInstance.get('/bindCodeApi/')
}

// 校验手机验证码
export async function checkVerificationCode(phoneInfo: any): Promise<any> {
  console.log(phoneInfo);
  return axiosInstance.post('/phoneCode/',{phonenumber: phoneInfo.phoneNumber, phonecode: phoneInfo.phonecode})
}
