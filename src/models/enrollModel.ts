import { Effect } from 'dva';
import { Reducer } from 'redux';
import { checkISEnroll, getContestantUnitData, getLimitEnroll } from '@/services/enrollServices';
import { getAllItem, getIndividualEnrollLimit } from '@/services/ruleServices';
import { convertAthleteList, convertItemData } from '@/utils/enroll';
import { message } from 'antd';

export interface EnrollTeamData {
  status: string;
  id: number;
  matchdata: number;
  unitdata: number;
  name: string;
  leader: string;
  leaderphonenumber: string;
  email: string;
  coachone: string;
  coachonephonenumber: string;
  coachtwo: string;
  coachtwophonenumber: string;
  dutybook: string;
  url_dutybook: string;
}

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
}

export interface EnrollModelType {
  namespace: 'enroll';
  state: EnrollModelState;
  effects: {
    // 获取本赛事本单位是否有参赛资格
    getEnrollLimit: Effect;
    getIndividualLimitation: Effect;
    getAllItemInfo: Effect;
    getContestantUnitData: Effect;
    checkIsEnrollAndGetAthleteLIST: Effect;
  };
  reducers: {
    clearState: Reducer<EnrollModelState>;
    modifyUnitInfo: Reducer<EnrollModelState>;
    modifyCurrentMatchId: Reducer<EnrollModelState>;
    modifyUnitData: Reducer<EnrollModelState>;
    modifyAthleteList: Reducer<EnrollModelState>;
    modifyIndividualLimitation: Reducer<EnrollModelState>;
    modifyItem: Reducer<EnrollModelState>;
    modifyContestantUnitData: Reducer<EnrollModelState>;
    modifyTeamEnroll: Reducer<EnrollModelState>;
  };
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
      teamEnrollList: [],
    },
    individualLimitation: {},
    individualItem: [],
    teamItem: [],
  },

  effects: {
    *getEnrollLimit({ payload, callback }, { _ }) {
      let res = yield getLimitEnroll(payload);
      if (callback) {
        callback(res);
      }
    },
    // 得到个人项目限制
    *getIndividualLimitation({ payload }, { put }) {
      const { matchId } = payload;
      let data = yield getIndividualEnrollLimit({ matchdata: matchId });
      if (data) {
        const { indivdualentrylimit } = data;
        let r = {
          isCrossGroup: indivdualentrylimit[0].crossgroup === 'True',
          upGroupNumber: indivdualentrylimit[0].upgroupnumber,
          itemLimitation: indivdualentrylimit[0].limitprojectnumber,
        };
        yield put({
          type: 'modifyIndividualLimitation',
          payload: { individualLimitation: r },
        });
      }
    },
    //获取所有项目
    *getAllItemInfo({ payload }, { put }) {
      const { matchId } = payload;
      let data = yield getAllItem({ matchdata: matchId });
      if (data) {
        let r = convertItemData(data);
        yield put({
          type: 'modifyItem',
          payload: { iI: r.iI, tI: r.tI },
        });
      }
    },
    // 获取参赛单位信息
    *getContestantUnitData({ payload }, { put }) {
      const { unitId, matchId } = payload;
      let data = yield getContestantUnitData({
        matchdata: matchId,
        unitdata: unitId,
      });
      if (data.length !== 0) {
        yield put({ type: 'modifyUnitData', payload: { unitData: data } });
      } else {
        yield put({ type: 'modifyUnitData', payload: { unitData: [] } });
      }
    },
    // 检查是否有报名信息，并获取运动员列表
    *checkIsEnrollAndGetAthleteLIST({ payload }, { put }) {
      const { matchId, unitId, contestant_id } = payload;
      if (!matchId || !unitId || !contestant_id) {
        return;
      }
      let data = yield checkISEnroll({
        unitdata: unitId,
        matchdata: matchId,
        contestant_id,
      });
      // 判断数据是否存在
      if (data) {
        if (data.isEnroll === 'Y') {
          // 参赛单位信息
          let contestantUnitData = data.contestant;
          yield put({
            type: 'modifyContestantUnitData',
            payload: { contestantUnitData },
          });
          // 运动员列表
          let athleteList = data.unitathlete;
          convertAthleteList(athleteList, data.teamenrolldata);
          yield put({ type: 'modifyAthleteList', payload: { athleteList } });
          // 团队报名列表
          let teamEnroll = data.teamenrolldata;
          let teamEnrollData: Array<any> = [];
          for (let i: number = 0; i < teamEnroll.length; i++) {
            if (
              Object.prototype.toString.call(teamEnroll[i].groupprojectenroll) === '[object Array]'
            ) {
              for (let j: number = 0; j < teamEnroll[i].groupprojectenroll.length; j++) {
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
          yield put({ type: 'modifyTeamEnroll', payload: { teamEnrollData } });
        } else {
          message.error('[enrollModel]data.isEnroll is false');
        }
      }
    },
  },

  reducers: {
    clearState(state, { _ }) {
      return {
        ...state,
        currentMatchId: -1,
        unitInfo: {},
        unit: {
          contestantUnitData: {},
          athleteList: [],
          singleEnrollList: [],
          teamEnrollList: [],
          unitData: [],
        },
        individualLimitation: {},
        individualItem: [],
        teamItem: [],
      };
    },
    modifyUnitInfo(state, { payload }) {
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
        },
      };
    },
    modifyCurrentMatchId(state, { payload }) {
      const { matchId } = payload;
      return {
        ...state,
        currentMatchId: matchId,
      };
    },
    modifyUnitData(state, { payload }) {
      const { unitData } = payload;
      return Object.assign({}, state, {
        unit: {
          ...state?.unit,
          unitData: unitData,
        },
      });
    },
    modifyAthleteList(state, { payload }) {
      const { athleteList } = payload;
      return Object.assign({}, state, {
        unit: {
          ...state?.unit,
          athleteList: athleteList,
        },
      });
    },
    modifyIndividualLimitation(state, { payload }) {
      const { individualLimitation } = payload;
      return {
        ...state,
        individualLimitation: individualLimitation,
      };
    },
    modifyItem(state, { payload }) {
      const { iI, tI } = payload;
      return {
        ...state,
        individualItem: iI,
        teamItem: tI,
      };
    },
    modifyContestantUnitData(state, { payload }) {
      const { contestantUnitData } = payload;
      return Object.assign({}, state, {
        unit: {
          ...state?.unit,
          contestantUnitData: contestantUnitData,
        },
      });
    },
    modifyTeamEnroll(state, { payload }) {
      const { teamEnrollData } = payload;
      return Object.assign({}, state, {
        unit: {
          ...state?.unit,
          teamEnrollList: teamEnrollData,
        },
      });
    },
  },
};

export default EnrollModel;
