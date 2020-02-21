import axiosInstance from '@/utils/request';

export async function getGameList() {
  return axiosInstance.get('/getmatchdata/');
}

export async function getHomePic(): Promise<any> {
  return axiosInstance.get('/reactfile/');
}

export async function getGroup_age(data: object): Promise<any> {
  return axiosInstance.get('/groupage/', { params: data });
}
