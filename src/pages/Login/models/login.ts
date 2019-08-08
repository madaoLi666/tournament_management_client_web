import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';

const LOGIN_MODEL:Model = {
  namespace: 'login',
  state: {},
  reducers: {},
  effects: {
    *sendVerification2Phone(action: AnyAction, effect: EffectsCommandMap){
      yield console.log();
    }
  }
};

export default LOGIN_MODEL;
