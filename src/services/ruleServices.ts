import axiosInstance from '@/utils/request';

// 获取参赛条件现在
export async function getIndividualEnrollLimit(data: object): Promise<any> {
  return axiosInstance.get('/indivdualentrylimit/', { data });
}

export async function getAllItem(data: object): Promise<any> {
  return axiosInstance.get('/matchdataopenprojectdata/', { data });
}

// 获取团队参数条件
export async function getTeamEnrollLimitation(data: object): Promise<any> {
  return axiosInstance.get('/unitentrylimit/', { data });
}
