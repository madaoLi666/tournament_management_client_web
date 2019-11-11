import { Effect } from 'dva'
import { AnyAction, Reducer } from 'redux';
import { checkVerificationCode, accountdata, checkAccountState } from '@/services/login.ts';
import router from 'umi/router';
import { deletePlayer } from '@/services/athlete';
import { message } from 'antd';
import { isIllegal } from '@/utils/judge';

// 单位账号的data
export interface UnitData {
  address?: string | null
  contactperson?: string | null
  contactphone?: string | null
  email?: string | null
  id?: number
  name?: string
  postalcode?: string | null
  province?: string | null
  registerunitfee?: number | null
  unitathlete?: {athlete:AthleteData, id: number, starttime: string, status: number, unitdata: number}[] | null
}

// 运动员信息
export interface AthleteData {
  address?: string | null
  birthday?: string
  emergencycontactpeople?: string | null
  emergencycontactpeoplephone?: string | null
  face?: string | null
  idcard?: string
  idcardtype?: string
  name?: string
  phonenumber?: string | null
  province?: string | null
  sex?: string
  user?: number
  id?: number
}

export interface UserModelState {
  id?: string;
  unitData?: Array<UnitData>;
  athleteData?: Array<AthleteData>;
  // 这个是判断个人账号与单位账号的，1代表个人，2代表单位
  unitAccount?: number;
  // 个人账号state
  username?: string;
  userPassword?: string;
  phonenumber?: string;
  email?: string;
  unitaccount?: string;
  unitathlete?: Array<any>;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    savePhone: Effect;
    checkCode: Effect;
    saveInfo: Effect;
    getAccountData: Effect;
    clearstate: Effect;
    deleteAthlete: Effect;
  };
  reducers: {
    modifyPhoneNumber: Reducer<UserModelState>;
    modifyUserInfo: Reducer<UserModelState>;
    modifyEmail: Reducer<UserModelState>;
    saveValue: Reducer<UserModelState>;
    saveUnitAccount: Reducer<UserModelState>;
    savePerson: Reducer<UserModelState>;
    clearState: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    // 单位账号state
    id:'',
    unitData: [],
    athleteData: [],
    // 这个是判断个人账号与单位账号的，1代表个人，2代表单位
    unitAccount: 0,
    // 个人账号state
    username:'',
    userPassword:'',
    phonenumber:'',
    email:'',
    unitaccount:'',
    unitathlete: []
  },
  reducers: {
    // 存手机进state
    modifyPhoneNumber(state, { payload }) {
      return {
        ...state,
        phonenumber: payload
      };
    },
    // 账号密码登陆校验
    modifyUserInfo(state, { payload }) {
      return {
        ...state,
        username: payload.username,
        userPassword: payload.password
      };
    },
    // 存email
    modifyEmail(state, { payload }) {
      return {
        ...state,
        email: payload
      };
    },
    // 个人注册后存的信息
    saveValue(state, { payload }) {
      return {
        ...state,
        username: payload.username,
        email: payload.email,
        unitaccount: payload.unitaccount,
        phonenumber: payload.phone
      };
    },
    // 存储单位账号信息
    saveUnitAccount(state: any, action: AnyAction): object {
      const { payload } = action;
      state.athleteData = payload.athlete;
      state.unitData[0] = payload.unitdata[0];
      state.email = payload.user.email;
      state.username = payload.user.username;
      state.id = payload.id;
      state.unitAccount = payload.unitaccount;
      state.phonenumber = payload.phonenumber;
      state.unitathlete = payload.unitdata[0].unitathlete;
      return state;
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
        phonenumber: payload.phonenumber
      };
    },
    // 清除state
    clearState(state,{ _ }) {
      return {
        ...state,
        id: '',
        unitData: [],
        athleteData: [],
        unitAccount: 0,
        username: '',
        userPassword: '',
        phonenumber: '',
        email: '',
        unitaccount: '',
        unitathlete: []
      };
    }
   },
  effects: {
    // 修改手机号码state
    * savePhone({ payload }, { put }) {
      yield put({type:'modifyPhoneNumber',payload: payload.phonenumber})
    },
    // 验证手机验证码是否正确
    * checkCode({ payload }, { put, select }) {
      let phone:any = yield select((state:any) => ({phoneNumber: state.user.phoneNumber}));
      let phoneInfo: {phonenumber:string, phonecode: string} = {phonenumber:phone.phoneNumber, phonecode: payload};
      // 验证手机号码与验证码
      let data = yield checkVerificationCode(phoneInfo);
      if (data) {
        let account_state = yield checkAccountState();
        if(account_state === 0) {
          router.push('/home');
        }else if(account_state === 3) {

        }else if(account_state === 4) {

        }else {
          message.error('该账号信息存在问题，请联系系统维护人员');
          router.push('/notFound')
        }
        router.push("/login/register");
        yield put({type: 'modifyPhoneNumber', payload: phone.phoneNumber})
      }else {
        message.warning('如果您收到的验证码是5位数，请再次点击发送验证码');
      }
    },
    // 个人注册成功后，存进state
    * saveInfo({ payload }, { put }) {
      yield put({type:'saveValue',payload: payload})
    },
    // 获取账号基本信息
    * getAccountData({ payload }, { put }) {
      let data = yield accountdata();
      if (data) {
        // ===2 代表是单位账号，还要多一项操作是调用获取单位账号下的运动员信息的接口
        if (data.unitaccount === 2) {
          if(!isIllegal(1,data,1)) {
            message.error('此账号存在问题，请联系本公司！');
            window.localStorage.clear();
            router.push('/home');
            return;
          }
          yield put({type: 'saveUnitAccount', payload: data});
          // 将unitData 设置
          yield put({type: 'enroll/modifyUnitInfo',payload: {unitInfo: data.unitdata[0]}})
        }else {
          // 代表是个人账号
          yield put({type: 'savePerson', payload: data});
        }
      }else {
        return;
      }
    },
    // 清除state
    * clearstate({ _ }, { put }) {
      yield put({type: 'clearState', payload:null});
    },
    // 删除运动员信息
    * deleteAthlete({ payload }, { put, select }) {
      let unitadata:UnitData = yield select((state:any) => (state.user.unitData[0]));
      let data = yield deletePlayer({
        unitdata: String(unitadata.id),
        athlete: String(unitadata.unitathlete[payload-1].athlete.id)
      });
      if(data) {
        message.success('删除成功');
        yield put({type:'getAccountData'});
      }
    }
  }
};

export default UserModel;
