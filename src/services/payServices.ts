import axiosInstance from '@/utils/request';

// 都是依照token
export async function getQRCodeForUnitRegister(data: object): Promise<any> {
  return axiosInstance.post('/newUnitAccount/', data);
}

export async function checkUnitIsPay(data: object): Promise<any> {
  return axiosInstance.post('/checkUnitRegisterPay/', data);
}

export async function getAccountBills(): Promise<any> {
  return axiosInstance.get('/accountbill/');
}
