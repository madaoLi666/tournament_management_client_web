import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';

const LOGIN_MODEL:Model = {
  namespace: 'login',
  state: {
    phoneNumber:''
  },
  reducers: {
    modifyPhoneNumber(state:any,action: AnyAction) {
      state.phoneNumber = action.phoneNumber;
      return state;
    }
  },
  effects: {
    *sendVerification2Phone(action: AnyAction, effect: EffectsCommandMap){
      yield console.log(action.payload);
      yield effect.put({type:'modifyPhoneNumber',phoneNumber:action.payload});
    }
  }
};

export default LOGIN_MODEL;
