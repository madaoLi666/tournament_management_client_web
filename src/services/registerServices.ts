import axiosInstance from '@/utils/request.ts';

// 请求发送邮箱验证码
export async function sendEmailVerificationCode(data: object): Promise<any> {
  return axiosInstance.get('/emailCode/', { params: data });
}

// 个人用户注册
export async function personalAccountRegister(data: object): Promise<any> {
  return axiosInstance.post('/personalAccountRegister/', data);
}
