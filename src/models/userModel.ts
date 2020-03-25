import { Reducer } from 'redux';
import { Effect } from 'dva';
import { accountdata } from '@/services/loginServices';
import { isIllegal } from '@/utils/judge';
import { message } from 'antd';
import { router } from 'umi';
import { deletePlayer } from '@/services/athleteServices';
import { modifyUnitData } from '@/services/unitServices';

// 单位账号的data
export interface UnitData {
  address?: string | null;
  contactperson?: string | null;
  contactphone?: string | null;
  email?: string | null;
  id?: number;
  name?: string;
  postalcode?: string | null;
  province?: string | null;
  registerunitfee?: number | null;
  unitathlete?:
    | {
        athlete: AthleteData;
        id: number;
        starttime: string;
        status: number;
        unitdata: number;
      }[]
    | null;
}

// 运动员信息
export interface AthleteData {
  address?: string | null;
  birthday: string;
  emergencycontactpeople?: string | null;
  emergencycontactpeoplephone?: string | null;
  face?: string | null;
  idcard: string;
  idcardtype?: string;
  name: string;
  phonenumber?: string;
  province?: string | null;
  sex: string;
  user?: number;
  id?: number;
  email?: string;
}

export interface UserModelState {
  id?: number;
  unitData?: Array<UnitData>;
  athleteData?: Array<AthleteData>;
  // 这个是判断个人账号与单位账号的，1代表个人，2代表单位
  unitAccount?: number;
  // 个人账号state
  username?: string;
  phonenumber?: string;
  email?: string;
  unitaccount?: string;
  unitathlete?: Array<any>;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    getAccountData: Effect;
    deleteAthlete: Effect;
    changeUnitBasicData: Effect;
  };
  reducers: {
    modifyUserInfo: Reducer<UserModelState>;
    modifyPhoneNumber: Reducer<UserModelState>;
    modifyEmail: Reducer<UserModelState>;
    saveInfo: Reducer<UserModelState>;
    clearState: Reducer<UserModelState>;
    saveUnitAccount: Reducer<UserModelState>;
    savePerson: Reducer<UserModelState>;
    modifyUnitBasicData: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    // 单位账号state
    id: 0,
    unitData: [],
    athleteData: [],
    // 这个是判断个人账号与单位账号的，1代表个人，2代表单位
    unitAccount: 0,
    // 个人账号state
    username: '',
    phonenumber: '',
    email: '',
    unitaccount: '',
    unitathlete: [],
  },
  effects: {
    // 获取账号基本信息
    *getAccountData({ callback }, { put }) {
      let data = yield accountdata();
      if (data) {
        // ===2 代表是单位账号，还要多一项操作是调用获取单位账号下的运动员信息的接口
        if (data.unitaccount === 2) {
          if (!isIllegal(1, data, 1)) {
            message.error('此账号存在问题，请联系本公司！');
            window.localStorage.clear();
            router.push('/home');
            if (callback) {
              callback(undefined);
            }
          }
          yield put({ type: 'saveUnitAccount', payload: data });
          // 将unitData 设置
          yield put({
            type: 'enroll/modifyUnitInfo',
            payload: { unitInfo: data.unitdata[0] },
          });
          yield put({
            type: 'unit/modifyUnitMainPart',
            payload: {
              mainpart: data.unitdata[0].mainpart,
              unitdata_id: data.unitdata[0].id,
              businesslicense: data.unitdata[0].businesslicense,
            },
          });
          if (callback) {
            callback(true);
          }
        } else {
          // 代表是个人账号和未补全的账号
          yield put({ type: 'savePerson', payload: data });
          if (callback) {
            callback(true);
          }
        }
      } else {
        if (callback) {
          callback(undefined);
        }
      }
    },
    *deleteAthlete({ payload }, { put, select }) {
      let unitData: UnitData = yield select((state: any) => state.user.unitData[0]);
      const data = yield deletePlayer({
        unitdata: String(unitData.id),
        athlete: String(payload),
      });
      if (data) {
        message.success('删除成功');
        yield put({ type: 'getAccountData' });
      }
    },
    *changeUnitBasicData({ payload, callback }, { put }) {
      let res = yield modifyUnitData(payload);
      if (res) {
        message.success(res);
        yield put({ type: 'modifyUnitBasicData', payload: payload });
      }
    },
  },
  reducers: {
    modifyUserInfo(state, { payload }) {
      return {
        ...state,
        username: payload.username,
      };
    },
    modifyPhoneNumber(state, { payload }) {
      return {
        ...state,
        phonenumber: payload.phonenumber,
      };
    },
    modifyEmail(state, { payload }) {
      return {
        ...state,
        email: payload,
      };
    },
    saveInfo(state, { payload }) {
      return {
        ...state,
        username: payload.username,
        email: payload.email,
        unitaccount: payload.unitaccount,
        phonenumber: payload.phone,
      };
    },
    // 清除state
    clearState(state, { _ }) {
      return {
        ...state,
        id: 0,
        unitData: [],
        athleteData: [],
        unitAccount: 0,
        username: '',
        userPassword: '',
        phonenumber: '',
        email: '',
        unitaccount: '',
        unitathlete: [],
      };
    },
    // 存储单位账号信息
    saveUnitAccount(state, { payload }) {
      let tempUnitData: any;
      if (state?.unitData) {
        state.unitData[0] = payload.unitdata[0];
        tempUnitData = state.unitData;
      }
      return {
        ...state,
        athleteData: payload.athlete,
        email: payload.user.email,
        username: payload.user.username,
        id: payload.id,
        unitAccount: payload.unitaccount,
        phonenumber: payload.phonenumber,
        unitathlete: payload.unitdata[0].unitathlete,
        unitData: tempUnitData,
      };
    },
    // 存储个人账号信息
    savePerson(state, { payload }) {
      return {
        ...state,
        athleteData: payload.athlete,
        email: payload.user.email,
        username: payload.user.username,
        id: payload.id,
        unitAccount: payload.unitaccount,
        phonenumber: payload.phonenumber,
      };
    },
    // 修改单位基本信息
    modifyUnitBasicData(state: any, { payload }) {
      state.unitData[0].name = payload.name;
      state.unitData[0].contactperson = payload.contactperson;
      state.unitData[0].contactphone = payload.contactphone;
      state.unitData[0].province = payload.province;
      state.unitData[0].address = payload.address;
      state.unitData[0].email = payload.email;
      state.unitData[0].postalcode = payload.postalcode;
      return { ...state };
    },
  },
};

export default UserModel;
