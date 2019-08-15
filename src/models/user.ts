import { Model, EffectsCommandMap } from 'dva'
import { AnyAction } from 'redux';
import { checkVerificationCode, Response } from '@/services/login.ts';
import router from 'umi/router';

const USER_MODEL:Model = {
  namespace: 'user',
  state: {
    username:'',
    userPassword:'',
    phoneNumber:'',
    email:'',
    unitaccount:'',
    token:'',
    errorstate:'',
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
    },
    // 修改errorstate,请求发送后的错误信息
    modifyError(state: any, action: AnyAction): object {
      const { error } = action;
      state.errorstate = error;
      return state;
    }
   },
  effects: {
    // 验证手机验证码是否正确
    *checkCode(action: AnyAction, effect: EffectsCommandMap) {
      let phone:any = yield effect.select((state:any) => ({phoneNumber: state.user.phoneNumber}))
      var phoneInfo: {phonenumber:string, phonecode: string} = {phonenumber:phone.phoneNumber, phonecode: action.payload};
      let res:Response = {data:'',error:'',notice:''};
      res = yield checkVerificationCode(phoneInfo)
      .then(function (res: Response) {
        return res;
      })
      .catch(function (err: Response) {
        console.log(err);
        return err;
      })
      if (res.data === "true") {
        router.push("/login/register");
      }else {
        yield effect.put({type: 'modifyError',error: res.error})
      }
    },
    // 个人注册成功后，存进state
    *saveInfo(action: AnyAction, effect: EffectsCommandMap) {
      console.log(action.value);
      yield effect.put({type:'saveValue',value:action.value})
    },
    // 清除errorState
    *clearError(action: AnyAction, effect: EffectsCommandMap) {
      yield effect.put({type: 'modifyError', error:''})
    }
  }
};

export default USER_MODEL;
