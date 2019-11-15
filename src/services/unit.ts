import axiosInstance from '@/utils/request.ts';

export async function modifyUnitData(data: object): Promise<any> {
    return axiosInstance.post('/basicunitdata/',data);
}