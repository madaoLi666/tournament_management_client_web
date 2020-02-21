import { Effect } from 'dva';
import { Reducer } from 'redux';

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
  effects: {};
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

  effects: {},

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
      // FIXED
      const { unitData } = payload;
      let unit: any;
      if (state !== undefined) {
        unit = state.unit;
      }
      return {
        ...state,
        unit: {
          ...unit,
          unitData: unitData,
        },
      };
    },
    modifyAthleteList(state, { payload }) {
      const { athleteList } = payload;
      return {
        ...state,
        unit: athleteList,
      };
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
      let unit: any;
      if (state?.unit) {
        unit.contestantUnitData = contestantUnitData;
      }
      return {
        ...state,
        unit,
      };
    },
    modifyTeamEnroll(state, { payload }) {
      const { teamEnrollData } = payload;
      let unit: any;
      if (state?.unit) {
        unit.teamEnrollList = teamEnrollData;
      }
      return {
        ...state,
        unit,
      };
    },
  },
};

export default EnrollModel;
