import { Effect } from 'dva';
import { Reducer } from 'redux';
import { getGameList } from '@/services/gamelist';

export interface GameListModelState {
  gameList?: Array<any>;
  maskloading?: boolean;
}

export interface GameListModelType {
  namespace: 'gameList';
  state: GameListModelState;
  effects: {
    getGameList: Effect;
  };
  reducers: {
    modifyGameList: Reducer<GameListModelState>;
  };
}

const GameListModel: GameListModelType = {
  namespace: 'gameList',
  state: {
    gameList: [],
    maskloading: false
  },
  effects: {
    *getGameList({ _ }, { put }){
      let data = yield getGameList();
      if(data) {
        yield put({
          type: 'modifyGameList',
          payload: {gameList: data}
        })
      }else{ return; }
    }
  },
  reducers: {
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
