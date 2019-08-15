import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone, Response } from '@/services/login.ts';
import { sendEmailVerificationCode, addAthleteInfo, setAthleteRole, registerUnitAccount } from '@/services/register.ts';
import router from 'umi/router';

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
      yield sendVerification2Phone(data)
        .then(function(res: Response) {
          console.log(res);
        })
        .catch(function(err: Response) {
          console.log(err);
        });
    },
    // 发送邮箱验证码
    * sendEmailCode(action: AnyAction, effect: EffectsCommandMap) {
      let data:{email: string} = {email: action.email};
      yield sendEmailVerificationCode(data)
        .then(function(res: Response) {
          console.log(res);
        })
        .catch(function(err: Response) {
          console.log(err);
        });
      yield effect.put({ type: 'user/modifyEmail', email: action.email });
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

    },
    // 注册单位账号
    * registerUnitAccount(action: AnyAction, effect: EffectsCommandMap) {
      const { select } = effect; const { unitData } = action.payload;
      let payCode = yield select(({register}:any) => {
        return register.unitRegisterPayCode;
      });
      yield console.log(payCode);
      let requestData =  yield {
        unitname: payCode,
        name: unitData.unitName,
        contactperson: unitData.contact,
        contactphone: unitData.phone,
        email: unitData.email,
        postalcode: unitData.postalCode,
        province: unitData.residence.city[0]+unitData.residence.city[1]+unitData.residence.city[2],
        address: unitData.residence.address,
        password: unitData.password
      };
      let res = yield registerUnitAccount(requestData);
      if(res.data === 'true'){
        // 修改user中的数据
        // @ts-ignore
        window.g_message.success('成功注册单位账号')
      }else{
        //
      }
    }
  },
};

export default RESISTER_MODEL;
