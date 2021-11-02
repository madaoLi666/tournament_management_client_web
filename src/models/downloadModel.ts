import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getHomePic } from '@/services/gameListService';

interface DownLoadModelState {
  downloadFileList: null | Array<{
    id: number,
    name: string,
    file: string
  }>
}

export interface DownLoadModelType {
  namespace: "download",
  state: DownLoadModelState,
  effects: {
    getDownloadFileList: Effect
  },
  reducers: {
    modifyDownloadFileList: Reducer<DownLoadModelState>
  }
}

const DownLoadModel: DownLoadModelType = {
  namespace: "download",
  state: {
    downloadFileList: null
  },
  effects: {
    *getDownloadFileList( _action, { put }) {
      const data = yield getHomePic();
      if(!data) {
        console.error('文件获取失败');
        return;
      }
      yield put({
        type: "modifyDownloadFileList",
        payload: {
          downloadFileList: data
        }
      })
    }
  },
  reducers: {
    modifyDownloadFileList(state, { payload }) {
      return {
        ...state,
        downloadFileList: payload.downloadFileList
      }
    }
  }
}

export default DownLoadModel