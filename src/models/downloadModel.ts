import { Effect } from 'dva';
import { Reducer } from 'redux';

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