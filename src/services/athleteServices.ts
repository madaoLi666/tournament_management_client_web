import axiosInstance from '@/utils/request';

// 获取单位账号下的运动员信息
export async function getUnitAthletesdata(data: object): Promise<any> {
  return axiosInstance.get('/unitathlete/', { params: data });
}

// 添加运动员
export async function addplayer(data: object): Promise<any> {
  return axiosInstance.post('/unitathlete/', data);
}

// 修改运动员信息
export async function updatePlayer(data: object): Promise<any> {
  return axiosInstance.post('/updateathletedata/', data);
}

// 删除运动员信息
export async function deletePlayer(data: object): Promise<any> {
  return axiosInstance.delete('/unitathlete/', { data: data });
}
