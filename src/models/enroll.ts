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
    },
    modifyUnitData(state: any, action: AnyAction){
      const { unitData } = action.payload;
      state.unitData = {
        id: unitData.id,
        unitName: unitData.name,
        province: unitData.province,
        address: unitData.address,
        email: unitData.email,
        contactPerson: unitData.contactperson,
        contactPhone: unitData.contactphone,
      };
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
