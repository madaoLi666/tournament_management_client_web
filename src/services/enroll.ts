import axiosInstance from '@/utils/request.ts';

// 参赛单位
// 修改 或 创建
export async function participativeUnit(data: FormData,opt: object):Promise<any> {
  return axiosInstance.post('/contestant/',data,opt);
}
