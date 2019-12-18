import {  Effect } from 'dva';
import {  Reducer } from 'redux';
import { getContestantUnitData , checkISEnroll, individualEnroll, getEnrolledProject, deleteTeam} from '@/services/enroll.ts';
import { getIndividualEnrollLimit, getAllItem } from '@/services/rules';
import { convertItemData, convertAthleteList} from '@/utils/enroll';
import { getLimitEnroll } from '@/services/enroll';
import { EnrollTeamData } from '@/pages/Enroll/ChoiceTeam/data';

/* 参赛单位信息 */
export interface ContestantUnitData {
  id?: number;
  matchdata?: number;
  unitdata?: number;
  name?: string;
  leader?: string;
  leaderphonenumber?: string;
  coachone?: string;
  coachonephonenumber?: string;
  coachtwo?: string;
  coachtwophonenumber?: string;
  dutybook?: string;
  email?: string;
}

interface UnitMes {
  unitData: EnrollTeamData[];
  contestantUnitData: ContestantUnitData;
  athleteList: Array<any>;
  singleEnrollList: Array<any>;
  teamEnrollList: Array<any>;
}

export interface EnrollModelState {
  currentMatchId?: number;
  unitInfo?: any;
  unit?: UnitMes;
  individualLimitation?: object;
  individualItem?: Array<any>;
  teamItem?: Array<any>;
  noticeVisbile?: boolean;
}

export interface EnrollModelType {
  namespace: 'enroll',
  state: EnrollModelState,
  effects: {
    getContestantUnitData: Effect;
    checkIsEnrollAndGetAthleteLIST: Effect;
    getIndividualLimitation: Effect;
    getAllItemInfo: Effect;
    individualEnroll: Effect;
    deleteTeamProject: Effect;
    clearstate: Effect;
    // 获取本赛事本单位是否有参赛资格
    getEnrollLimit: Effect;
  },
  reducers: {
    modifyCurrentMatchId: Reducer<EnrollModelState>;
    modifyUnitInfo: Reducer<EnrollModelState>;
    modifyUnitData: Reducer<EnrollModelState>;
    modifyAthleteList: Reducer<EnrollModelState>;
    modifyIndividualLimitation: Reducer<EnrollModelState>;
    modifyItem: Reducer<EnrollModelState>;
    modifyContestantUnitData: Reducer<EnrollModelState>;
    modifyTeamEnroll: Reducer<EnrollModelState>;
    clearState: Reducer<EnrollModelState>;
    modifyNoticeVisible: Reducer<EnrollModelState>;
  }
}

const EnrollModel: EnrollModelType = {
  namespace: 'enroll',
  state: {
    currentMatchId: -1,
    unitInfo: {},
    unit: {
      unitData: [],
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
  effects: {
    * getEnrollLimit({ payload, callback }, { put }) {
      let res = yield getLimitEnroll(payload);
      if(callback) { callback(res) }
    },
    // 获取参赛单位信息
    * getContestantUnitData ({ payload }, { put }) {
      const { unitId, matchId } = payload;
      let data = yield getContestantUnitData({matchdata: matchId, unitdata: unitId});
      if(data.length !== 0) {
        yield put({ type: "modifyUnitData", payload: { unitData: data} })
      }else {
        yield put({ type: "modifyUnitData", payload: { unitData: []} })
      }
    },
    // 检查是否有报名信息，并获取运动员列表
    * checkIsEnrollAndGetAthleteLIST  ({ payload }, { put }) {
      const { matchId, unitId, contestant_id } = payload;
      let data = yield checkISEnroll({unitdata: unitId, matchdata: matchId, contestant_id});
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
    * getIndividualLimitation ({payload}, {put}) {
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
    * getAllItemInfo ({payload}, {put}) {
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
    * individualEnroll ({payload}, {put, select}) {
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
    * deleteTeamProject({ payload }, { put }) {
      let res = yield getEnrolledProject(payload);
      // 如果有已经报了名的团队项目
      if(res.groupproject.length !== 0) {
        for(let i:number = 0;i < res.groupproject.length;i++){
          let newRes = yield deleteTeam({teamenroll: res.groupproject[i].team_id});
        }
      }
    },
    * clearstate({ payload }, { put }) {
      yield put({type: 'clearState', payload:null});
    },
  },
  reducers: {
    modifyCurrentMatchId(state, { payload }){
      const { matchId } = payload;
      return {
        ...state,
        currentMatchId: matchId
      };
    },
    modifyUnitInfo(state, { payload }){
      const { unitInfo } = payload;
      return {
        ...state,
        unitInfo: {
          id: unitInfo.id,
          unitName: unitInfo.name,
          province: unitInfo.province,
          address: unitInfo.address,
          email: unitInfo.email,
          contactPerson: unitInfo.contactperson,
          contactPhone: unitInfo.contactphone,
        }
      };
    },
    modifyUnitData(state, { payload }){
      const { unitData } = payload;
      state.unit.unitData = unitData;
      return state;
    },
    modifyAthleteList (state, { payload }){
      const { athleteList } = payload;
      state.unit.athleteList = athleteList;
      return state;
    },
    modifyIndividualLimitation(state, { payload }){
      const { individualLimitation } = payload;
      return {
        ...state,
        individualLimitation: individualLimitation
      };
    },
    modifyItem(state, { payload }){
      const { iI, tI } = payload;
      return {
        ...state,
        individualItem: iI,
        teamItem: tI
      };
    },
    modifyContestantUnitData(state, { payload }){
      const { contestantUnitData } = payload;
      state.unit.contestantUnitData = contestantUnitData;
      return state;
    },
    modifyTeamEnroll(state, { payload }) {
      const { teamEnrollData } = payload;
      state.unit.teamEnrollList = teamEnrollData;
      return state;
    },
    clearState(state, { payload }) {
      return {
        ...state,
        currentMatchId: -1,
        unitInfo: {},
        unit: {
          contestantUnitData: {},
          athleteList: [],
          singleEnrollList: [],
          teamEnrollList: [],
          unitData: []
        },
        individualLimitation: {},
        individualItem: [],
        teamItem: []
      };
    },
    modifyNoticeVisible(state, { payload }){
      // 这里为了方便 直接改那个系统通知
      return {
        ...state,
        noticeVisbile: false
      };
    },
    }
};

export default EnrollModel;
