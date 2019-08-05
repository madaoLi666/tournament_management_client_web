import axiosInstance from '@/utils/request.ts';

// 请求发送手机验证码
export async function sendVerification2Phone(data: object): Promise<any> {
  return axiosInstance.get('phoneCode/',{data: data});
}
