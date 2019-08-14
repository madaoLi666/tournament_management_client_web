import axiosInstance from '@/utils/request.ts';

// 接口返回数据格式
export interface Response {
  data: string
  error: string
  notice: string
}


export async function Login(data: object): Promise<any>{
  console.log(data);
  return axiosInstance.post('/api-token-auth/',data);
}

// 请求发送手机验证码
export async function sendVerification2Phone(data: object): Promise<any> {
  return axiosInstance.get('/phoneCode/',{params: data});
}

// 获取验证码图片
export async function getVerificationPic(): Promise<any> {
  return axiosInstance.get('/bindCodeApi/')
}

// 校验手机验证码
export async function checkVerificationCode(data: object): Promise<any> {
  console.log(data);
  return axiosInstance.post('/phoneCode/',data);
}


export async function checkAccountState(data?:object): Promise<any> {
  return axiosInstance.get('/checkregisterstep/');
}
