import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone, Response, Login } from '@/services/login.ts';

const LOGIN_MODEL:Model = {
  namespace: 'login',
  state: {

  },
  reducers: {

  },
  effects: {
    // 账号密码登陆的请求
    *sendLoginRequest(action: AnyAction, effect: EffectsCommandMap) {
      const { payload } = action; const { put } = effect;
      console.log(payload);
      let res = yield Login(payload);
      console.log(res);
      // payload.username,payload.password
      // yield effect.put({type:'user/modifyUserInfo',userInfo: action.payload})
    },
    // 发送手机验证码
    *sendPhoneNumberForCode(action: AnyAction, effect: EffectsCommandMap) {
      yield sendVerification2Phone(action.payload)
            .then(function (res: Response) {
              console.log(res);
            })
            .catch(function (err: Response) {
              console.log(err);
            });
      // TODO 怎么增加判别
      yield effect.put({type: 'user/modifyPhoneNumber', phoneNumber: action.payload})
    },
  }
};

export default LOGIN_MODEL;
