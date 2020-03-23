import { Reducer } from 'redux';
import { Effect } from 'dva';
import { addAthleteInfo, registerUnitAccount } from '@/services/registerServices';
import { router } from 'umi';
import { message } from 'antd';

export interface CompleteModelState {
  unitRegisterPayCode?: string;
}

export interface CompleteModelType {
  namespace: 'complete';
  state: CompleteModelState;
  effects: {
    addAthleteBaseInfo: Effect;
    registerUnitAccount: Effect;
  };
  reducers: {
    modifyUnitRegisterPayCode: Reducer<CompleteModelState>;
  };
}

const CompleteModel: CompleteModelType = {
  namespace: 'complete',
  state: {
    unitRegisterPayCode: '',
  },
  effects: {
    *addAthleteBaseInfo({ payload }, { _ }) {
      const requestData = {
        idcardtype: payload.idCardType,
        idcard: payload.identifyNumber,
        sex: payload.sex,
        birthday: payload.birthday,
        name: payload.name,
        user: payload.user,
      };
      let data = yield addAthleteInfo(requestData);
      //设置成功 跳转至角色设置中
      if (data) {
        message.success('完善成功!');
        router.push('/complete/1');
      }
    },
    *registerUnitAccount({ payload }, { select, put }) {
      const { unitData } = payload;
      let payCode = yield select(({ complete }: any) => {
        return complete.unitRegisterPayCode;
      });
      let user_id: any = yield select((state: any) => ({ userId: state.user.id }));
      let requestData = yield {
        unitname: payCode,
        name: unitData.unitName,
        contactperson: unitData.contact,
        contactphone: unitData.phone,
        email: unitData.email,
        postalcode: unitData.postalCode,
        province:
          unitData.residence.city[0] + unitData.residence.city[1] + unitData.residence.city[2],
        address: unitData.residence.address,
        password: unitData.password,
        user: unitData.userId,
        user_id,
      };
      let data = yield registerUnitAccount(requestData);
      if (data) {
        message.success('成功注册单位账号，请重新登陆');
        router.push('/login');
      } else {
        message.error('注册单位失败，请检查网络状况与付款状况');
      }
    },
  },
  reducers: {
    modifyUnitRegisterPayCode(state, { payload }) {
      if (payload.hasOwnProperty('payCode')) {
        return {
          ...state,
          unitRegisterPayCode: payload['payCode'],
        };
      }
      return {
        ...state,
      };
    },
  },
};

export default CompleteModel;
