import { Reducer } from 'redux';
import { Effect } from 'dva';

export interface AccountModelState {
  items?: Array<number>;
  byId?: any;
}

export interface AccountModelType {
  namespace: 'account';
  state: AccountModelState;
  effects: {};
  reducers: {};
}

const AccountModel: AccountModelType = {
  namespace: 'account',
  state: {
    items: [],
    byId: {},
  },
  effects: {},
  reducers: {},
};

export default AccountModel;
