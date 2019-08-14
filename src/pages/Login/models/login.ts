import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone, Response, Login } from '@/services/login.ts';
import router from 'umi/router';

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
      let res = yield Login(payload);
      if(res){
        // 本地存储token
        yield  window.localStorage.setItem('TOKEN',res.data);
        yield put({type:'user/modifyUserInfo',userInfo: action.payload});
        yield router.push('/user');
      }
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
