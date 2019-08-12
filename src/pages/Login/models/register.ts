import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone, Response } from '@/services/login.ts';
import { sendEmailVerificationCode,personalAccountRegister,PersonInfo } from '@/services/register.ts';


const RESISTER_MODEL:Model = {
    namespace: 'register',
    state: {
        verificationCode:'132'
    },
    reducers: {
        modifyCode(state: any, action: AnyAction) {
            state.verificationCode = action.verificationCode;
            return state;
        }
    },
    effects: {
        *sendVerificationCode(action: AnyAction, effect: EffectsCommandMap) {
            // 发送手机验证码
            let phone:any = yield effect.select((state:any) => ({phonenumber: state.user.phoneNumber}))
            yield sendVerification2Phone(phone.phonenumber)
            .then(function (res: Response) {
                console.log(res);
            })
            .catch(function (err: Response) {
                console.log(err)
            })
        },
        // 发送邮箱验证码
        *sendEmailCode(action: AnyAction, effect: EffectsCommandMap) {
           yield sendEmailVerificationCode(action.email)
           .then(function (res: Response) {
               console.log(res);
           })
           .catch(function (err: Response) {
               console.log(err);
           })
           yield effect.put({type: 'user/modifyEmail', email:action.email})
        },
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
    }
};

export default RESISTER_MODEL;
