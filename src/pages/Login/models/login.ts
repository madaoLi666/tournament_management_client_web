import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone } from '@/services/login.ts';

const LOGIN_MODEL:Model = {
  namespace: 'login',
  state: {},
  reducers: {

  },
  effects: {
    *sendVerification2Phone(action: AnyAction, effect: EffectsCommandMap){
      yield console.log();
    }
  }
};

export default LOGIN_MODEL;
