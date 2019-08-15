import axiosInstance from '@/utils/request.ts';


// 都是依照token
export async function getQRCodeForUnitRegister(): Promise<any>{
  return axiosInstance.post('/newUnitAccount/');
}

export async function checkUnitIsPay(): Promise<any>{
  return axiosInstance.post('/checkUnitRegisterPay/');
}
