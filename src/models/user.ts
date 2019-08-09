import { Model } from 'dva'
import { AnyAction } from 'redux';

const USER_MODEL:Model = {
  namespace: 'user',
  state: {
    name: 'an',
    username:'',
    userPassword:'',
    phoneNumber:'',
  },
  reducers: {
    modifyPhoneNumber(state:any,action: AnyAction) {
      state.phoneNumber = action.phoneNumber;
      return state;
    },
    modifyUserInfo(state:any, action: AnyAction) {
      state.username = action.userInfo.username;
      state.userPassword = action.userInfo.password;
      return state;
    }
  },
  effects: {}
};

export default USER_MODEL;
