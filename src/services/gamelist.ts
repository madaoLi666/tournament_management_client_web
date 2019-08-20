import axiosInstance from '@/utils/request';

export async function getGameList() {
  return axiosInstance.get('/getmatchdata/');
}
