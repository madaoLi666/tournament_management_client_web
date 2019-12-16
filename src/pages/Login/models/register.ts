import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone, Response } from '@/services/login.ts';
import { sendEmailVerificationCode, addAthleteInfo, setAthleteRole, registerUnitAccount, bindUnitAccount } from '@/services/register.ts';
import router from 'umi/router';
import { message } from 'antd';

const RESISTER_MODEL: Model = {
  namespace: 'register',
  state: {
    verificationCode: '132',
    unitRegisterPayCode: ''
  },
  reducers: {
    modifyCode(state: any, action: AnyAction) {
      state.verificationCode = action.verificationCode;
      return state;
    },
    // 修改单位payCode 用于注册单位账号
    modifyUnitRegisterPayCode(state: any, action: AnyAction): any{
      if(action.payload.hasOwnProperty('payCode')){
        state.unitRegisterPayCode = action.payload['payCode'];
      }
      return state;
    }
  },
  effects: {
    * sendVerificationCode(action: AnyAction, effect: EffectsCommandMap) {
      // 发送手机验证码
      let phone: any = yield effect.select((state: any) => ({ phonenumber: state.user.phoneNumber }));
      let data:{phonenumber: string} = {phonenumber: phone.phonenumber};
      let res = yield sendVerification2Phone(data)
      if (res) {
        // TODO
      }
    },
    // 发送邮箱验证码
    * sendEmailCode(action: AnyAction, effect: EffectsCommandMap) {
      let data:{email: string} = {email: action.payload};
      let res = yield sendEmailVerificationCode(data)
      if (res) {
        // TODO
      }
      yield effect.put({ type: 'user/modifyEmail', payload: action.payload });
    },
    // 为账号补全其个人信息
    * addAthleteBaseInfo(action: AnyAction, effect: EffectsCommandMap) {
      const { payload } = action;
      const requestData = {
        idcardtype: payload.certificationType,
        idcard: payload.certificationNumber,
        sex: payload.sex,
        birthday: payload.birthday,
        name: payload.name,
        user: payload.user
      };
      let data = yield addAthleteInfo(requestData);
      //设置成功 跳转至角色设置中
      if(data) yield router.push('/login/setRole');
    },
    // 注册成为个人账号
    * setAthleteRole(action: AnyAction, effect: EffectsCommandMap) {
      let user_id: any = yield effect.select((state: any) => ({userId: state.login.userId}));
      let data = yield setAthleteRole({user_id: user_id.userId});
      if(data) {
        message.success('成功注册个人账号，请重新登录');
        yield router.push('/user/list');
      }
    },
    // 注册单位账号
    * registerUnitAccount(action: AnyAction, effect: EffectsCommandMap) {
      const { select } = effect; const { unitData } = action.payload;
      let payCode = yield select(({register}:any) => {
        return register.unitRegisterPayCode;
      });
      let user_id: any = yield effect.select((state: any) => ({userId: state.login.userId}));
      // yield console.log(payCode);
      let requestData =  yield {
        unitname: payCode,
        name: unitData.unitName,
        contactperson: unitData.contact,
        contactphone: unitData.phone,
        email: unitData.email,
        postalcode: unitData.postalCode,
        province: unitData.residence.city[0]+unitData.residence.city[1]+unitData.residence.city[2],
        address: unitData.residence.address,
        password: unitData.password,
        user:unitData.userId,
        user_id:user_id.userId
      };
      let data = yield registerUnitAccount(requestData);
      if(data) {
        message.success('成功注册单位账号，请重新登陆');
        router.push('/login');
      }else {
        message.error('注册单位失败，请检查网络状况与付款状况');
      }
    },
    // 绑定单位账号
    * bindUnitAccountAndSendCode(action: AnyAction, effect: EffectsCommandMap) {
      let data = yield bindUnitAccount(action.payload);
      //689422
      if(data) {
        message.info('绑定单位成功');
        router.push('/home');
      }else {
        message.warning('请重新登录一次再进行绑定单位');
      }
    }
  },
};

export default RESISTER_MODEL;
