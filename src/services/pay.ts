import axiosInstance from '@/utils/request.ts';

export async function getQRCodeForUnitRegister(data: object): Promise<any>{
  return axiosInstance.post('/newUnitAccount/', data);
}
