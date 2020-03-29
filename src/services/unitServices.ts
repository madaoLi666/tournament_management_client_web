import axiosInstance from '@/utils/request.ts';

export async function modifyUnitData(data: object): Promise<any> {
  return axiosInstance.post('/basicunitdata/', data);
}

export async function modifyMainPart(data: object): Promise<any> {
  return axiosInstance.post('/uploadbusinesslicense/', data);
}
// 操作记录
export async function getOperationLog(): Promise<any> {
  return axiosInstance.get('/operationlog/');
}
