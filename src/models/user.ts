import { Model, EffectsCommandMap } from 'dva'
import { AnyAction } from 'redux';
import { checkVerificationCode, accountdata } from '@/services/login.ts';
import { message } from 'antd';
import router from 'umi/router';

// 单位账号的data
interface UnitData {
  address?: string | null
  contactperson?: string | null
  contactphone?: string | null
  email?: string | null
  id?: number
  name?: string
  postalcode?: string | null
  province?: string | null
  registerunitfee?: number | null
}

// 单位账号的运动员信息
interface AthleteData {
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
    // 个人账号state
    username:'',
    userPassword:'',
    phonenumber:'',
    email:'',
    unitaccount:'',
    token:'',
    errorstate:'',
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
      state.phonenumber = payload.phonenumber;
      return state;
    }
   },
  effects: {
    // 验证手机验证码是否正确
    *checkCode(action: AnyAction, effect: EffectsCommandMap) {
      const { put } = effect;
      let phone:any = yield effect.select((state:any) => ({phoneNumber: state.user.phoneNumber}))
      var phoneInfo: {phonenumber:string, phonecode: string} = {phonenumber:phone.phoneNumber, phonecode: action.payload};
      let res = yield checkVerificationCode(phoneInfo);
      if (res) {
        if (res.data === "true") {
          router.push("/login/register");
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
          // ===2 代表是单位账号
          yield effect.put({type: 'saveUnitAccount', payload: res.data})
        }else {
          // 代表是个人账号

        }
      }else {

      }
    }
  }
};

export default USER_MODEL;
