import { Model, EffectsCommandMap } from 'dva'
import { AnyAction } from 'redux';
import { checkVerificationCode, Response } from '@/services/login.ts';
import router from 'umi/router';

const USER_MODEL:Model = {
  namespace: 'user',
  state: {
    name: 'an',
    username:'',
    userPassword:'',
    phoneNumber:'',
    email:''
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
    }
  },
  effects: {
    // 验证手机验证码是否正确
    *checkCode(action: AnyAction, effect: EffectsCommandMap) {
      let phone:any = yield effect.select((state:any) => ({phoneNumber: state.user.phoneNumber}))
      var phoneInfo: {phoneNumber:string, phonecode: string} = {phoneNumber:phone.phoneNumber, phonecode: action.payload};
      yield checkVerificationCode(phoneInfo)
      .then(function (res: Response) {
        if ( res.data == "true" ) {
          router.push('/login/register')
        }
      })
      .catch(function (err: Response) {
        console.log(err)
      })
    },
  }
};

export default USER_MODEL;
