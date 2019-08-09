import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone } from '@/services/login.ts';

const LOGIN_MODEL:Model = {
  namespace: 'login',
  state: {
  },
  reducers: {
    
  },
  effects: {
    *sendVerification2Phone(action: AnyAction, effect: EffectsCommandMap){
      yield effect.put({type:'user/modifyPhoneNumber',phoneNumber:action.payload});
    },
    *sendLoginRequser(action: AnyAction, effect: EffectsCommandMap) {
      // payload.username,payload.password
      yield effect.put({type:'user/modifyUserInfo',userInfo: action.payload})
    }
  }
};

export default LOGIN_MODEL;
