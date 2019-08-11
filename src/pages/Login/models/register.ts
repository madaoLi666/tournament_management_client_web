import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';

import { checkoutPayStatus } from '@/services/register';


const REGISTER: Model = {
  namespace: 'register',
  state: {},
  reducers: {

  },
  effects: {
    *registerUnitAccount(action: AnyAction, effect: EffectsCommandMap) {
      yield console.log(effect);
    },
    *checkoutUnitRegisterPayStatus(action: AnyAction, effect: EffectsCommandMap) {
      console.log('i');
      let res = yield checkoutPayStatus();
      yield console.log(res);
    }
  }
};

export default REGISTER
