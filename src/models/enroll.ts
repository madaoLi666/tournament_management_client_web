import router from 'umi/router';
import { Model, EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { getContestantUnitData , checkISEnroll, individualEnroll} from '@/services/enroll.ts';
import { getIndividualEnrollLimit, getAllItem } from '@/services/rules';
import { convertItemData } from '@/utils/enroll';

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
    },
    individualLimitation: {

    },
    individualItem: [],
    teamItem: []
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
    },
    modifyAthleteList (state: any, action: AnyAction){
      const { athleteList } = action.payload;
      state.unit.athleteList = athleteList;
      return state;
    },
    modifyIndividualLimitation(state: any, action: AnyAction){
      const { individualLimitation } = action.payload;
      state.individualLimitation = individualLimitation;
      return state;
    },
    modifyItem(state: any, action: AnyAction){
      const { iI, tI } = action.payload;
      state.individualItem = iI;
      state.teamItem = tI;
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
      const { matchId, unitId } = action.payload;
      let res = yield checkISEnroll({unitdata: unitId, matchdata: matchId});
      // 判断数据是否存在
      if(res.error === "" && res.notice === "" && res.data !== "") {
        // 是否已经进行了报名
        if(res.data.isEnroll === 'Y') {
          let athleteList = res.data.unitathlete;
          console.log(athleteList);
          // 修改
          yield put({
            type: 'modifyAthleteList',
            payload: { athleteList }
          })
        }
      }
    },
    * getIndividualLimitation ({payload}: AnyAction, {put}: EffectsCommandMap) {
      const { matchId } = payload;
      let res = yield getIndividualEnrollLimit({matchdata: matchId});
      //
      if(res.error === "" && res.notice === "" && res.data) {
        const { indivdualentrylimit } = res.data;
        let r = {
          isCrossGroup: indivdualentrylimit[0].crossgroup === "True",
          upGroupNumber: indivdualentrylimit[0].upgroupnumber,
          itemLimitation: indivdualentrylimit[0].limitprojectnumber
        };
        yield put({
          type: 'modifyIndividualLimitation',
          payload: { individualLimitation:r }
        })
      }
    },
    * getAllItemInfo ({payload}: AnyAction, {put}: EffectsCommandMap) {
      const { matchId } = payload;
      let res = yield getAllItem({matchdata: matchId});
      if(res.error === "" && res.notice === "" && res.data) {
        const { data } = res;
        let r = convertItemData(data);
        yield put({
          type: 'modifyItem',
          payload: {iI: r.iI, tI: r.tI}
        })
      }
    },
    * individualEnroll ({payload}: AnyAction, {put, select}: EffectsCommandMap) {
      const { enrollData } = payload;
      let res = yield individualEnroll(enrollData);
      if(res.error === "" && res.notice === "" && res.data === "true") {
        yield put({
          type: 'checkIsEnrollAndGetAthleteLIST',
          payload:{
            unitId:select((state:any) => state.unitInfo.id),
            matchId:select((state:any) => state.currentMatchId)
          }
        })
      }
    },
    // * t (action: AnyAction, {select}: EffectsCommandMap) {
    //   yield console.log
    // }
  }
};

export default ENROLL_MODEL;
