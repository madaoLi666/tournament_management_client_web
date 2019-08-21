import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone, Response, Login } from '@/services/login.ts';
import router from 'umi/router';

const LOGIN_MODEL:Model = {
  namespace: 'login',
  state: {
    userId:-1
  },
  reducers: {
    modifyUserId(state: any, action: AnyAction) {
      const { userId } = action.payload;
      console.log(state);
      state.userId = userId;
      return state;
    }
  },
  effects: {
    // 账号密码登陆的请求
    *sendLoginRequest(action: AnyAction, effect: EffectsCommandMap) {
      const { payload } = action; const { put } = effect;
      let res = yield Login(payload);
      if(res && res.notice === '' && res.data !== ""){
        // 本地存储token
        yield window.localStorage.setItem('TOKEN',res.data);
        yield put({type:'user/modifyUserInfo',payload: action.payload});
        yield router.push('/home');
      }else if(res.notice !== ""){
        const { msg, user } = res.notice;
        console.log('a');
        if(msg === "3") {
          // 未补全运动员信息
          yield router.push('/login/infoSupplement');
          yield put({type: 'modifyUserId',payload: {userId: user}});
        }else if(msg === "4") {
          // 未设置运动员角色
          yield router.push('/login/setRole');
          yield put({type: 'modifyUserId',payload: {userId: user}});
        }
      }
    },
    // 发送手机验证码
    *sendPhoneNumberForCode(action: AnyAction, effect: EffectsCommandMap) {
      let data:{phonenumber: string} = {phonenumber: action.payload};
      let res = yield sendVerification2Phone(data);
      if (res) {
        if (res.data === "true") {
          // TODO
        }else {
          // TODO
        }
      }
      yield effect.put({type: 'user/modifyPhoneNumber', payload: action.payload})
    },
  }
};

export default LOGIN_MODEL;
