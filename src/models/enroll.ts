import router from 'umi/router';
import { Model, EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { getContestantUnitData, newUnitAthlete , checkISEnroll} from '@/services/enroll.ts';

const ENROLL_MODEL: Model = {
  namespace: 'enroll',
  state: {
    currentMatchId: -1,
    unitInfo: {},
    unit: {
      unitData: {},
      athleteList: [],
      singleEnrollList: [],
      teamEnrollList: []
    }
  },
  reducers: {
    modifyCurrentMatchId(state: any, action: AnyAction){
      const { matchId } = action.payload;
      state.currentMatchId = matchId;
      return state;
    },
    modifyUnitInfo(state: any, action: AnyAction){
      const { unitInfo } = action.payload;
      state.unitInfo = {
        id: unitInfo.id,
        unitName: unitInfo.name,
        province: unitInfo.province,
        address: unitInfo.address,
        email: unitInfo.email,
        contactPerson: unitInfo.contactperson,
        contactPhone: unitInfo.contactphone,
      };
      return state;
    },
    modifyUnitData(state: any, action: AnyAction){
      const { unitData } = action.payload;
      state.unit.unitData = unitData;
      return state;
    }
  },
  effects: {
    * getContestantUnitData (action: AnyAction, effect: EffectsCommandMap) {
      const { put } = effect;
      const { unitId, matchId } = action.payload;
      let res = yield getContestantUnitData({matchdata: matchId, unitdata: unitId});
      if(res.error === "" && res.notice === "" && res.data !== "") {
        const { data } = yield res;
        let uD = {
          id: data.id,
          leaderName: data.leader,
          leaderPhone: data.leaderphonenumber,
          leaderEmail: data.email,
          coach1Name: data.coachone,
          coach1Phone: data.coachonephonenumber,
          coach2Name: data.coachtwo,
          coach2Phone: data.coachtwophonenumber,
          guaranteePic: data.dutybook
        };
        yield put({
          type: "modifyUnitData",
          payload: { unitData: uD}
        })
      }
    },
    * checkIsEnrollAndGetAthleteLIST  (action: AnyAction, effect: EffectsCommandMap) {
      const { put } = effect;
      const { matchId, unitId } = yield action.payload;
      let res = yield checkISEnroll({unitdata: unitId, matchdata: matchId});
      yield console.log(res);
    }
  }
};

export default ENROLL_MODEL;
