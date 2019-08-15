import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone, Response } from '@/services/login.ts';
import { sendEmailVerificationCode, addAthleteInfo, setAthleteRole } from '@/services/register.ts';
import router from 'umi/router';

const RESISTER_MODEL: Model = {
  namespace: 'register',
  state: {
    
  },
  reducers: {
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
      };
      let res = yield addAthleteInfo(requestData);
      //设置成功 跳转至角色设置中
      if (res && res.data === 'true') yield router.push('/login/setRole');
    },
    // 注册成为个人账号
    * setAthleteRole(action: AnyAction) {
      let res = yield setAthleteRole();
      if(res && res.data === 'true') yield router.push('/');

    }
  },
};

export default RESISTER_MODEL;
