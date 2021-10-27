import axiosInstance from '@/utils/request';

// 业余信息查询
export async function amateurlevelRawScoreSearch(data: object): Promise<any> {
  return axiosInstance.get('/rawexaminationscore/', { params: data });
}