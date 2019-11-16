import axiosInstance from '@/utils/request.ts';

// 参赛单位
// 修改 或 创建
export async function participativeUnit(data: FormData,opt: object):Promise<any> {
  return axiosInstance.post('/contestant/',data,opt);
}

// 单位账号获取本场赛事参加单位信息
export async function getContestantUnitData(data: object):Promise<any>{
    return axiosInstance.get('/contestant/', {data:data});
}

// 添加运动员
export async function newUnitAthlete(data: FormData, opt: object):Promise<any>{
    return axiosInstance.post('/unitathlete/',data, opt);
}

// 删除运动员
export async function deleteAthlete(data: object):Promise<any>{
    return axiosInstance.delete('/unitathlete/', {data:data});
}

// 检查单位是否有本次比赛参赛信息
export async function checkISEnroll(data: object):Promise<any>{
    return axiosInstance.post('/checkisenroll/',data);
}

// 添加参赛运动员
export async function addParticipantsAthlete(data: object):Promise<any>{
    return axiosInstance.post('/player/', data);
}

// 删除参赛运动员
export async function deleteParticipantsAthlete(data: object):Promise<any>{
    return axiosInstance.delete('/player/', {data: data});
}

// 个人报名
export async function individualEnroll(data: object):Promise<any>{
    return axiosInstance.post('/personalprojectenroll/', data);
}
export async function deleteIndividualEnroll(data: object):Promise<any>{
    return axiosInstance.delete('/personalprojectenroll/', {data});
}
// 团队报名
export async function teamEnroll(data:object):Promise<any>{
    return axiosInstance.post('/teamenroll/',data);
}
// 删除队伍参赛项目
export async function deleteTeamEnrollItem(data:object):Promise<any>{
    return axiosInstance.delete('/groupprojectenroll/',{data});
}

// 提交资格证书
export async function submitCertificationNumber(data:object):Promise<any>{
    return axiosInstance.post('/submitCertificationCode/',data);
}

// 通过赛事id，单位id和运动员id获取该运动员所参加的项目信息
export async function getEnrolledProject(data: object): Promise<any> {
    return axiosInstance.post('/athleteenrolldata/',data);
}

// 通过队伍id，来删除队伍参赛的项目
export async function deleteTeam(data:object):Promise<any>{
    return axiosInstance.delete('/teamenroll/',{data});
}

// 获取本场赛事本个单位是否有参赛资格
export async function getLimitEnroll(data: object): Promise<any> {
    return axiosInstance.get('/matchdataunitdatalimit/', { params: data});
}

// 发送邮件查看报名数据
export async function sendEmail(data: object): Promise<any> {
  return axiosInstance.get('/sendenrollsuccessemail/', { params: data });
}
