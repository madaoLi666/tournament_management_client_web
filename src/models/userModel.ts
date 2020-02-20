import { Reducer } from 'redux';

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
  birthday?: string;
  emergencycontactpeople?: string | null;
  emergencycontactpeoplephone?: string | null;
  face?: string | null;
  idcard?: string;
  idcardtype?: string;
  name?: string;
  phonenumber?: string | null;
  province?: string | null;
  sex?: string;
  user?: number;
  id?: number;
}

export interface UserModelState {
  id?: string;
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
  effects: {};
  reducers: {
    modifyUserInfo: Reducer<UserModelState>;
    modifyPhoneNumber: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    // 单位账号state
    id: '',
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
  effects: {},
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
  },
};

export default UserModel;
