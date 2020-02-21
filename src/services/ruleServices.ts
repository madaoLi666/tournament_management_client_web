import axiosInstance from '@/utils/request.ts';

// 获取参赛条件现在
export async function getIndividualEnrollLimit(data: object): Promise<any> {
  return axiosInstance.get('/indivdualentrylimit/', { data });
}

export async function getAllItem(data: object): Promise<any> {
  return axiosInstance.get('/matchdataopenprojectdata/', { data });
}
