import { Model, EffectsCommandMap } from 'dva'
import { AnyAction } from 'redux';
import { checkVerificationCode, Response } from '@/services/login.ts';
import { message } from 'antd';
import router from 'umi/router';

const USER_MODEL:Model = {
  namespace: 'user',
  state: {

    username:'',
    userPassword:'',
    phoneNumber:'13118875236',
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
    *saveInfo(action: AnyAction, effect: EffectsCommandMap) {
      console.log(action.payload);
      yield effect.put({type:'saveValue',payload:action.payload})
    },
    // 清除errorState
    *clearError(action: AnyAction, effect: EffectsCommandMap) {
      yield effect.put({type: 'modifyError', payload:''})
    }
  }
};

export default USER_MODEL;
