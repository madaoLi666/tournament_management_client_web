import { Reducer } from 'redux';
import { Effect } from 'dva';
import { getAccountBills } from '@/services/payServices';

/*
  账单信息model, AccountBill 为账单信息的类型
 */

export interface AccountBill {
  title: string;
  time: string;
  status: string;
  price: number;
  way: string;
}

export interface AccountModelState {
  items?: Array<number>;
  byId?: Array<AccountBill>;
}

export interface AccountModelType {
  namespace: 'account';
  state: AccountModelState;
  effects: {
    getAccountBill: Effect;
  };
  reducers: {
    modifyAccountBill: Reducer<AccountModelState>;
  };
}

const AccountModel: AccountModelType = {
  namespace: 'account',
  state: {
    items: [],
    byId: [],
  },
  effects: {
    *getAccountBill({ _ }, { put }) {
      const data = yield getAccountBills();
      if (data) {
        yield put({ type: 'modifyAccountBill', payload: data });
      }
    },
  },
  reducers: {
    modifyAccountBill(state, { payload }) {
      const byId: Array<AccountBill> = [];
      const items: Array<number> = [];
      payload.forEach((item: any, index: any) => {
        items.push(index);
        byId[index] = item;
      });
      return {
        ...state,
        items,
        byId,
      };
    },
  },
};

export default AccountModel;
