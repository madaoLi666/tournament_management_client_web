import { Effect } from 'dva';
import { sendEmailVerificationCode } from '@/services/registerServices';
import { message } from 'antd';

export interface RegisterModelState {}

export interface RegisterModelType {
  namespace: 'register';
  state: RegisterModelState;
  effects: {
    sendEmailCode: Effect;
  };
  reducers: {};
}

const RegisterModel: RegisterModelType = {
  namespace: 'register',

  state: {},

  effects: {
    *sendEmailCode({ payload }, { put }) {
      let res = yield sendEmailVerificationCode({ email: payload });
      if (!res) {
        message.error('[register]sendCode:' + JSON.stringify(res));
        console.error('[register]sendCode:' + JSON.stringify(res));
        return;
      }
      yield put({ type: 'user/modifyEmail', payload: payload });
    },
  },

  reducers: {},
};

export default RegisterModel;
