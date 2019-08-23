import { Model, EffectsCommandMap } from 'dva'
import { AnyAction } from 'redux';
import { checkVerificationCode, accountdata } from '@/services/login.ts';
import { message } from 'antd';
import router from 'umi/router';
import { addplayer } from '@/services/athlete';

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
}

const USER_MODEL:Model = {
  namespace: 'user',
  state: {
    // 单位账号state
    id:'',
    unitData:<UnitData>[],
    athleteData:<AthleteData>[],
    // 这个是判断个人账号与单位账号的，1代表个人，2代表单位
    unitAccount:<number>1,
    // 个人账号state
    username:'',
    userPassword:'',
    phonenumber:'',
    email:'',
    unitaccount:'',
    errorstate:'',

    token:'',
  },
  reducers: {
    // 存手机进state
    modifyPhoneNumber(state:any,action: AnyAction) {
      state.phoneNumber = action.payload;
      return state;
    },
    // 账号密码登陆校验
    modifyUserInfo(state:any, action: AnyAction) {
      state.username = action.payload.username;
      state.userPassword = action.payload.password;
      return state;
    },
    // 存email
    modifyEmail(state: any, action: AnyAction) {
      state.email = action.payload;
      return state;
    },
    // 个人注册后存的信息
    saveValue(state: any, action: AnyAction) {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.unitaccount = action.payload.unitaccount;
      return state;
    },
    // 将本地的token设置到store中
    setStoreByLocal(state: any, action: AnyAction): object {
      const { payload } = action;
      // state类型未定
      state.token = payload.token;
      return state;
    },
    // 修改errorstate,请求发送后的错误信息
    modifyError(state: any, action: AnyAction): object {
      const { payload } = action;
      state.errorstate = payload;
      return state;
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
    savePerson(state: any, action: AnyAction): object {
      const { payload } = action;
      state.athleteData = payload.athlete;
      state.email = payload.user.email;
      state.username = payload.user.username;
      state.id = payload.id;
      state.unitAccount = payload.unitaccount;
      state.phonenumber = payload.phonenumber;
      return state;
    },
    // 清除state
    clearState(state: any, action: AnyAction): object {
      state.id = ''
      state.unitData = <UnitData>[]
      state.athleteData = <AthleteData>[]
      // 这个是判断个人账号与单位账号的，1代表个人，2代表单位
      state.unitAccount = 1;
      // 个人账号state
      state.username = '';
      state.userPassword = '';
      state.phonenumber = '';
      state.email = '';
      state.unitaccount = '';
      state.token = '';
      state.errorstate = '';
      return state;
    }
   },
  effects: {
    // 修改手机号码state
    * savePhone(action: AnyAction, effect: EffectsCommandMap) {
      yield effect.put({type:'modifyPhoneNumber',payload:action.payload.phonenumber})
    },
    // 验证手机验证码是否正确
    *checkCode(action: AnyAction, effect: EffectsCommandMap) {
      let phone:any = yield effect.select((state:any) => ({phoneNumber: state.user.phoneNumber}));
      let phoneInfo: {phonenumber:string, phonecode: string} = {phonenumber:phone.phoneNumber, phonecode: action.payload};
      // 验证手机号码与验证码
      let res = yield checkVerificationCode(phoneInfo);
      if (res) {
        if (res.data === "true") {
          router.push("/login/register");
          yield console.log(action.payload);
          yield effect.put({type: 'modifyPhoneNumber', payload: phone.phoneNumber})

        }else {
          yield effect.put({type: 'modifyError',payload: res.error})
        }
      }
    },
    // 个人注册成功后，存进state
    * saveInfo(action: AnyAction, effect: EffectsCommandMap) {
      console.log(action.payload);
      yield effect.put({type:'saveValue',payload:action.payload})
    },
    // 清除errorState
    * clearError(action: AnyAction, effect: EffectsCommandMap) {
      yield effect.put({type: 'modifyError', payload:''})
    },
    // 获取账号基本信息
    * getAccountData(action: AnyAction, effect: EffectsCommandMap) {
      let res = yield accountdata();
      console.log(res);
      if (res) {
        if (res.data.unitaccount === 2) {
          // ===2 代表是单位账号，还要多一项操作是调用获取单位账号下的运动员信息的接口
          yield effect.put({type: 'saveUnitAccount', payload: res.data});
        }else {
          // 代表是个人账号
          yield effect.put({type: 'savePerson', payload: res.data});
        }
      }else {

      }
    },
    // 清除state
    * clearstate(action: AnyAction, effect: EffectsCommandMap) {
      yield effect.put({type: 'clearState'})
    },
    // 删除运动员信息
    * deleteAthlete(action: AnyAction, effect: EffectsCommandMap) {
      yield console.log(action.payload);
    }
  }
};

export default USER_MODEL;
