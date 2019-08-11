import axiosInstance from '@/utils/request.ts';


// 查询单位付款信息
export async function checkoutPayStatus(data?: object):Promise<any> {
  return axiosInstance.post('/checkUnitRegisterPay/', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  });
}

// 注册单位账号
export async function registerUnitAccount(data: object):Promise<any> {
  return axiosInstance.post('/unitdata/',data);
}
