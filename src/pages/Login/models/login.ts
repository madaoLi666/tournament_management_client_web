import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { sendVerification2Phone } from '@/services/login.ts';

export default {
  namespace: 'login',
  state: {},
  reducers: {

  },
  effects: {
    *sendVerification2Phone(action: AnyAction, effect: EffectsCommandMap){
      yield console.log('a');
    }
  }
}
