import axiosInstarnce from '@/utils/request';

export async function getGameList() {
  return axiosInstarnce.get('/matchdata/');
}
