import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { sendVerification2Phone } from '@/services/login.ts';


const RESISTER_MODEL:Model = {
    namespace: 'register',
    state: {
        verificationCode:''
    },
    reducers: {
        modifyCode(state: any, action: AnyAction) {
            state.verificationCode = action.verificationCode;
            return state;
        }
    },
    effects: {
        *sendVerificationCode(action: AnyAction, effect: EffectsCommandMap) {
            yield sendVerification2Phone('15626466587')
            .then(function (res:any) {
                console.log(res);
            })
            .catch(function (err) {
                console.log(err)
            })
        }
    }
};

export default RESISTER_MODEL;
