import { Model, EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { getGameList } from '@/services/gamelist';

const GAMELIST_INTRODUCTION:Model = {
  namespace: 'gameList',
  state: {
    gameList: [],
  },
  reducers: {
    modifyGameList(state: any,action: AnyAction) {
      const { payload } = action;
      state.gameList = payload.gameList;
      return state;
    }
  },
  effects: {
    *getGameList(action: AnyAction, effect: EffectsCommandMap ){
      const { put } = effect;
      let data = yield getGameList();
      if(data) {
        yield put({
          type: 'modifyGameList',
          payload: {gameList: data}
        })
      }
    }
  },

};

export default GAMELIST_INTRODUCTION;
