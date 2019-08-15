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
    phoneNumber:'15626466587',
    email:'',
    unitaccount:'',
    token:''
  },
  reducers: {
    // 存手机进state
    modifyPhoneNumber(state:any,action: AnyAction) {
      state.phoneNumber = action.phoneNumber;
      return state;
    },
    // 账号密码登陆校验
    modifyUserInfo(state:any, action: AnyAction) {
      state.username = action.userInfo.username;
      state.userPassword = action.userInfo.password;
      return state;
    },
    // 存email
    modifyEmail(state: any, action: AnyAction) {
      state.email = action.email;
      return state;
    },
    // 个人注册后存的信息
    saveValue(state: any, action: AnyAction) {
      state.username = action.value.username;
      state.email = action.value.email;
      state.unitaccount = action.value.unitaccount;
      return state;
    },
    // 将本地的token设置到store中
    setStoreByLocal(state: any, action: AnyAction): object {
      const { payload } = action;
      // state类型未定
      state.token = payload.token;
      return state;
    }
  },
  effects: {
    // 验证手机验证码是否正确
    *checkCode(action: AnyAction, effect: EffectsCommandMap) {
      let phone:any = yield effect.select((state:any) => ({phoneNumber: state.user.phoneNumber}))
      let phoneInfo: {phoneNumber:string, phonecode: string} = {phoneNumber:phone.phoneNumber, phonecode: action.payload};
      let res = yield checkVerificationCode(phoneInfo);
      if(res.data === 'true'){
        yield router.push('/login/register')
      }else{
        //@ts-ignore
        yield message.error('');
      }
    },
    // 个人注册成功后，存进state
    *saveInfo(action: AnyAction, effect: EffectsCommandMap) {
      console.log(action.value);
      yield effect.put({type:'saveValue',value:action.value})
    }
  }
};

export default USER_MODEL;
