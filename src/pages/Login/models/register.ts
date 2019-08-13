import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone, Response } from '@/services/login.ts';
import { sendEmailVerificationCode, addAthleteInfo, setAthleteRole } from '@/services/register.ts';
import router from 'umi/router';

const RESISTER_MODEL: Model = {
  namespace: 'register',
  state: {
    verificationCode: '132',
  },
  reducers: {
    modifyCode(state: any, action: AnyAction) {
      state.verificationCode = action.verificationCode;
      return state;
    },
  },
  effects: {
    * sendVerificationCode(action: AnyAction, effect: EffectsCommandMap) {
      // 发送手机验证码
      let phone: any = yield effect.select((state: any) => ({ phonenumber: state.user.phoneNumber }));
      yield sendVerification2Phone(phone.phonenumber)
        .then(function(res: Response) {
          console.log(res);
        })
        .catch(function(err: Response) {
          console.log(err);
        });
    },
    // 发送邮箱验证码
    * sendEmailCode(action: AnyAction, effect: EffectsCommandMap) {
      yield sendEmailVerificationCode(action.email)
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

    }
    // 个人注册
    // *personRegister(action: AnyAction, effect: EffectsCommandMap) {
    //     let phone:any = yield effect.select((state:any) => ({phonenumber: state.user.phoneNumber}))
    //     let personInfo:PersonInfo = {
    //         Username: action.person.userID,
    //         Password: action.person.password,
    //         Email: action.person.email,
    //         Emailcode: action.person.emailVerificationCode,
    //         Phonenumber: phone.phonenumber,
    //     }
    //     yield personalAccountRegister(personInfo)
    //     .then(function (res:Response) {
    //         console.log(res)
    //     })
    //     .catch(function (err:Response) {
    //         console.log(err)
    //     })
    // },
  },
};

export default RESISTER_MODEL;
