import axiosInstance from '@/utils/request.ts';

// 获取单位账号下的运动员信息
export async function getUnitAthletesdata(data: object): Promise<any> {
    return axiosInstance.get('/unitathlete/',{ params: data });
}

// 添加运动员
export async function addplayer(data: object): Promise<any> {
  return axiosInstance.post('/unitathlete/',data);
}
