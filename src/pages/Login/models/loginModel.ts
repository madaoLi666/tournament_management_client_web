import { Reducer } from 'redux';
import { Effect } from 'dva';
import { loginRequest, sendVerification2Phone } from '@/services/loginServices';
import { message } from 'antd';
import { router } from 'umi';

export interface LoginModelState {}

export interface LoginModelType {
  namespace: 'login';
  state: LoginModelState;
  effects: {
    sendLoginRequest: Effect; // 登录请求处理
    sendPhoneNumberForCode: Effect; // 发送验证码
  };
  reducers: {};
}

const LoginModel: LoginModelType = {
  namespace: 'login',

  state: {},

  effects: {
    *sendLoginRequest({ payload }, { put }) {
      const res = yield loginRequest(payload);
      if (res !== undefined && res.notice === '' && res.data !== '') {
        // 本地存储token
        window.localStorage.setItem('TOKEN', res.data);
        yield put({ type: 'user/modifyUserInfo', payload: payload });
        message.success('登录成功！');
        router.push('/home');
      }
    },
    *sendPhoneNumberForCode({ payload }, { put }) {
      let res = yield sendVerification2Phone(payload);
      // 是否需要替换
      if (!res) {
        message.error('[sendPhoneCode]' + JSON.stringify(res));
        console.error('[sendPhoneCode]' + JSON.stringify(res));
      }
      yield put({ type: 'user/modifyPhoneNumber', payload: payload });
    },
  },

  reducers: {},
};

export default LoginModel;
