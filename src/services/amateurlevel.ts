import axiosInstance from '@/utils/request';

// 业余信息查询
export async function amateurlevelRawScoreSearch(data: object): Promise<any> {
  return axiosInstance.get('/rawexaminationscore/', { params: data });
}

// 获取业余等级考评场次

export async function getAmateurExaminationList() {
  return axiosInstance.get('/amateurexaminationdata/');
}

// 获取开设考点
export async function getExamineeUnit(params: any) {
  return axiosInstance.get('/examineeunit/', { params });
}
// 开设考点
export async function createExamineeUnit(params: any) {
  return axiosInstance.post('/examineeunit/', params);
}

// 修改考点名称
export async function patchExamineeUnit(params: any) {
  return axiosInstance.post('/examineeunit/', params);
}

// 获取考生列表
export async function getExamineeList(params: any) {
  return axiosInstance.get('/examinee/', { params });
}

// 添加考生（会顺便注册运动员）
export async function createExaminee(params: FormData, opt: object) {
  return axiosInstance.post('/examinee/', params, opt);
}

// 根据业余考试id 获取业余水平考试项目
export async function getAmateurExaminationItem(params: any){
  return axiosInstance.get(`/amateurexaminationdataitem/`, {params});
}

// 报名
export async function examinationEnroll(params: any) {
  return axiosInstance.post('/examinationenroll/', params);
}