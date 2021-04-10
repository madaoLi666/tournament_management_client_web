import axiosInstance from '@/utils/request';

// 请求发送邮箱验证码
export async function sendEmailVerificationCode(data: object): Promise<any> {
  return axiosInstance.get('/emailCode/', { params: data });
}

// 个人用户注册
export async function personalAccountRegister(data: object): Promise<any> {
  return axiosInstance.post('/personalAccountRegister/', data);
}

// 补充个人信息
export async function addAthleteInfo(data: object): Promise<any> {
  return axiosInstance.post('/athletedata/', data);
}

// 注册成为个人账号
export async function setAthleteRole(data: object): Promise<any> {
  return axiosInstance.post('/accountType/', data);
}

// 注册单位账号
export async function registerUnitAccount(data: object): Promise<any> {
  return axiosInstance.post('/unitdata/', data);
}

// 绑定单位账号
export async function bindUnitAccount(data: object): Promise<any> {
  return axiosInstance.post('/bindUnitAccount/', data);
}

// 检索此单位是否可注册
export async function newUnitAccount(data: object): Promise<any> {
  return axiosInstance.get('/newUnitAccount/', {
    params: data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}
