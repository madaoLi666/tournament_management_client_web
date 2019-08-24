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

// 检查单位是否有本次比赛参赛信息
export async function checkISEnroll(data: object):Promise<any>{
    return axiosInstance.post('/checkisenroll/',data);
}
