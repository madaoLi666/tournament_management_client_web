import axiosInstance from '@/utils/request.ts';
import { async } from 'q';

// 请求发送手机验证码
export async function sendVerification2Phone(data: string): Promise<any> {
  return axiosInstance.get('/phoneCode/',{params:{phonenumber: data}});
}

// 获取验证码图片
export async function getVerificationPic(): Promise<any> {
  return axiosInstance.get('/bindCodeApi/')
}
