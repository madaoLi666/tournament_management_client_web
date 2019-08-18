import axiosInstance from '@/utils/request.ts';

// 个人用户注册信息接口
export interface PersonInfo {
  username: string
  password: string
  email: string
  emailcode: string
  phonenumber: string
  phonecode?: string
}

// 请求发送邮箱验证码
export async function sendEmailVerificationCode(data: object): Promise<any> {
    return axiosInstance.get('/emailCode/',{ params: data })
}

// 个人用户注册
export async function personalAccountRegister(data: object): Promise<any> {
    return axiosInstance.post('/personalAccountRegister/',data);
}

// 补充个人信息
export async function addAthleteInfo(data: object):Promise<any> {
  return axiosInstance.post('/athletedata/',data);
}

// 注册成为个人账号
export async function setAthleteRole(): Promise<any> {
  return axiosInstance.post('/accountType/');
}

// 注册单位账号
export async function registerUnitAccount(data: object):Promise<any> {
  return axiosInstance.post('/unitdata/', data);
}

// 绑定单位账号
export async function bindUnitAccount(data: object): Promise<any> {
  return axiosInstance.post('/bindUnitAccount/', data);
}
