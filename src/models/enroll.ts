import router from 'umi/router';
import { Model, EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { getContestantUnitData , checkISEnroll, individualEnroll, getEnrolledProject, deleteTeam} from '@/services/enroll.ts';
import { getIndividualEnrollLimit, getAllItem } from '@/services/rules';
import { convertItemData, convertAthleteList} from '@/utils/enroll';

const ENROLL_MODEL: Model = {
  namespace: 'enroll',
  state: {
    currentMatchId: -1,
    unitInfo: {},
    unit: {
      unitData:{},
      contestantUnitData: {},
      athleteList: [],
      singleEnrollList: [],
      teamEnrollList: []
    },
    individualLimitation: {

    },
    individualItem: [],
    teamItem: [],
    noticeVisbile: true
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
    },
    modifyContestantUnitData(state: any, action: AnyAction){
      const { contestantUnitData } = action.payload;
      state.unit.contestantUnitData = contestantUnitData;
      return state;
    },
    modifyTeamEnroll(state:any, action: AnyAction) {
      const { teamEnrollData } = action.payload;
      state.unit.teamEnrollList = teamEnrollData;
      return state;
    },
    clearState(state: any, action: AnyAction) {
      state.currentMatchId = -1,
      state.unitInfo = {},
      state.unit.contestantUnitData = {},
      state.unit.athleteList = [],
      state.unit.singleEnrollList = [],
      state.unit.teamEnrollList = [],
      state.individualLimitation = {},
      state.individualItem = [],
      state.teamItem = []
      return state;
    },
    modifyNoticeVisible(state: any, action: AnyAction){
      // 这里为了方便 直接改那个系统通知
      state.noticeVisbile = false;
      return state;
    }
  },
  effects: {
    // 获取参赛单位信息
    * getContestantUnitData (action: AnyAction, effect: EffectsCommandMap) {
      const { put } = effect;
      const { unitId, matchId } = action.payload;
      let data = yield getContestantUnitData({matchdata: matchId, unitdata: unitId});
      if(data) {
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
        yield put({ type: "modifyUnitData", payload: { unitData: uD} })
      }
    },
    // 检查是否有报名信息，并获取运动员列表
    * checkIsEnrollAndGetAthleteLIST  (action: AnyAction, effect: EffectsCommandMap) {
      const { put } = effect;
      const { matchId, unitId } = action.payload;
      let data = yield checkISEnroll({unitdata: unitId, matchdata: matchId});
      // 判断数据是否存在
      if(data) {
        if(data.isEnroll === 'Y') {
          // 参赛单位信息
          let contestantUnitData = data.contestant;
          yield put({ type: 'modifyContestantUnitData', payload: { contestantUnitData } });
          // 运动员列表
          let athleteList = data.unitathlete;
          convertAthleteList(athleteList,data.teamenrolldata);
          yield put({ type: 'modifyAthleteList', payload: { athleteList } });
          // 团队报名列表
          let teamEnroll = data.teamenrolldata;

          let teamEnrollData:Array<any> = [];
          for(let i:number = 0 ; i < teamEnroll.length ; i++) {
            if(Object.prototype.toString.call(teamEnroll[i].groupprojectenroll) === '[object Array]') {
              for(let j:number = 0 ; j < teamEnroll[i].groupprojectenroll.length ; j++) {
                teamEnrollData.push({
                  itemGroupSexName: teamEnroll[i].groupprojectenroll[j].name,
                  open_group_id: teamEnroll[i].groupprojectenroll[j].openprojectgroupsex_id,
                  // 用于删除项目
                  id: teamEnroll[i].groupprojectenroll[j].id,
                  teamName: teamEnroll[i].name,
                  member: teamEnroll[i].teammember,
                });
              }
            }
          }
          yield put({ type: 'modifyTeamEnroll', payload: {teamEnrollData}});
        }
      }
    },
    // 得到个人项目限制
    * getIndividualLimitation ({payload}: AnyAction, {put}: EffectsCommandMap) {
      const { matchId } = payload;
      let data = yield getIndividualEnrollLimit({matchdata: matchId});
      if(data) {
        const { indivdualentrylimit } = data;
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
    //获取所有项目
    * getAllItemInfo ({payload}: AnyAction, {put}: EffectsCommandMap) {
      const { matchId } = payload;
      let data = yield getAllItem({matchdata: matchId});
      if( data ) {
        let r = convertItemData(data);
        yield put({
          type: 'modifyItem',
          payload: {iI: r.iI, tI: r.tI}
        })
      }
    },
    * individualEnroll ({payload}: AnyAction, {put, select}: EffectsCommandMap) {
      const { enrollData } = payload;
      let data = yield individualEnroll(enrollData);
      if(data) {
        yield put({
          type: 'checkIsEnrollAndGetAthleteLIST',
          payload:{
            unitId: yield select((state:any) => state.enroll.unitInfo.id),
            matchId: yield select((state:any) => state.enroll.currentMatchId)
          }
        })
      }
    },
    // 删除参赛运动员时关联删除他的团队参赛项目
    * deleteTeamProject(action: AnyAction, effect: EffectsCommandMap) {
      yield console.log(action.payload);
      let res = yield getEnrolledProject(action.payload);
      // 如果有已经报了名的团队项目
      if(res.groupproject.length !== 0) {
        for(let i:number = 0;i < res.groupproject.length;i++){
          let newRes = yield deleteTeam({teamenroll: res.groupproject[i].team_id});
        }
      }
    },
    * clearstate(action: AnyAction, effect: EffectsCommandMap) {
      yield effect.put({type: 'clearState', payload:null});
    },
  }
};

export default ENROLL_MODEL;
