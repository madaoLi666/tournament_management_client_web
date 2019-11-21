import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getGameList, getGroup_age } from '@/services/gamelist';

export interface GroupAgeList {
  cn_name: string;
  en_name: string;
  endtime: string;
  id: number;
  matchdata: number;
  number: number;
  starttime: string;
  valuetype: string | null;
}

export interface GameListModelState {
  gameList?: Array<any>;
  maskloading?: boolean;
  group_age?: Array<GroupAgeList>;
}

export interface GameListModelType {
  namespace: 'gameList';
  state: GameListModelState;
  effects: {
    getGameList: Effect;
    // 获取预设组别年龄
    getGroupAge: Effect;
  };
  reducers: {
    modifyGameList: Reducer<GameListModelState>;
    setGroupAgeList: Reducer<GameListModelState>;
  };
}

const GameListModel: GameListModelType = {
  namespace: 'gameList',
  state: {
    gameList: [],
    maskloading: false
  },
  effects: {
    * getGroupAge({ payload }, { put }) {
      let res: Array<GroupAgeList> = yield getGroup_age(payload);
      if (res.length !== 0) {
        for(let i = 0; i < res.length; i++) {
          res[i].starttime = res[i].starttime.substr(0,10);
          res[i].endtime = res[i].endtime.substr(0,10);
        }
        yield put({type: 'setGroupAgeList', payload: res});
      }else { console.log('group_age is null'); }
    },
    *getGameList({ callback }, { put }){
      let data = yield getGameList();
      if(data) {
        yield put({
          type: 'modifyGameList',
          payload: {gameList: data}
        });
        if(callback){callback(data);}
      }else{ if(callback){callback(undefined);} }
    }
  },
  reducers: {
    setGroupAgeList(state, { payload }) {
      return {
        ...state,
        group_age: payload
      }
    },
    modifyGameList(state, { payload }) {
      return {
        ...state,
        gameList: payload.gameList,
        maskloading: true
      };
    }
  }

};

export default GameListModel;
