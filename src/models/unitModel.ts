import { Reducer } from 'redux';
import { Effect } from 'dva';
import { message } from 'antd';
import { modifyMainPart } from '@/services/unitServices';

export interface UnitModelState {
  mainpart?: string | null;
  unitdata_id?: number;
  businesslicense?: string | null;
}

export interface UnitModelType {
  namespace: 'unit';
  state: UnitModelState;
  effects: {
    changeUnitMainPart: Effect;
  };
  reducers: {
    modifyUnitMainPart: Reducer<UnitModelState>;
  };
}

const UnitModel: UnitModelType = {
  namespace: 'unit',
  state: {
    mainpart: '',
    unitdata_id: 0,
    businesslicense: '',
  },
  effects: {
    *changeUnitMainPart({ payload, callback }, { put }) {
      console.log(payload);
      let res = yield modifyMainPart(payload);
      if (res) {
        message.success(res);
        callback(true);
      } else {
        callback(false);
      }
    },
  },
  reducers: {
    modifyUnitMainPart(state, { payload }) {
      return {
        ...state,
        mainpart: payload.mainpart,
        unitdata_id: payload.unitdata_id,
        businesslicense: payload.businesslicense,
      };
    },
  },
};

export default UnitModel;
