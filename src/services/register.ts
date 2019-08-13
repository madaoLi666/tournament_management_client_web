import axiosInstance from '@/utils/request.ts';

// 个人用户注册信息接口
export interface PersonInfo {
    Username: string
    Password: string
    Email: string
    Emailcode: string
    Phonenumber: string
    Phonecode?: string
}

// 请求发送邮箱验证码
export async function sendEmailVerificationCode(email: string): Promise<any> {
    return axiosInstance.get('/emailCode/',{ params:{ email: email } })
}

// 个人用户注册
export async function personalAccountRegister(personInfo: PersonInfo): Promise<any> {
    return axiosInstance.post('/personalAccountRegister/',{
        username: personInfo.Username,
        password: personInfo.Password,
        email: personInfo.Email,
        emailcode: personInfo.Emailcode,
        phonenumber: personInfo.Phonenumber,
        phonecode: personInfo.Phonecode
    })
}

// 补充个人信息
export async function addAthleteInfo(data: object):Promise<any> {
  return axiosInstance.post('/athletedata/',data);
}

// 注册成为个人账号
export async function setAthleteRole(): Promise<any> {
  return axiosInstance.post('/accountType/');
}
