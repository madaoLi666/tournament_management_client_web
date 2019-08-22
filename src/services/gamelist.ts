import axiosInstance from '@/utils/request';

export async function getGameList() {
  return axiosInstance.get('/getmatchdata/');
}

export async function getHomePic():Promise<any>{
    return axiosInstance.get('/reactfile/');
}
