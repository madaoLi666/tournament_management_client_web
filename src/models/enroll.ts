import router from 'umi/router';
import { Model, EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { participativeUnit } from '@/services/enroll.ts';

const ENROLL_MODEL: Model = {
  namespace: 'enroll',
  state: {
    currentMatchId: -1,
    unitData:{}
  },
  reducers: {
    modifyCurrentMatchId(state: any, action: AnyAction){
      const { matchId } = action.payload;
      state.currentMatchId = matchId;
      return state;
    }
  },
  effects: {
    * newOrEditParticipativeUnitInfo (action: AnyAction, effect: EffectsCommandMap) {
      yield console.log('a');
    }
  }
};

export default ENROLL_MODEL;
