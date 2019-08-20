import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { addAthleteInfo } from '@/services/register';
import { getUnitAthletesdata } from '@/services/athlete';

const ATHLETES_MESSAGE_MODEL:Model = {
    namespace: 'athletes',
    state: {
        // 运动员信息state
        message:[]
    },
    reducers: {
        // 存储信息
        saveMessage(state: any, action: AnyAction) {
            let length = state.message.length;
            state.message[length] = action.payload;
            return state;
        }
    },
    effects: {
        // 获取单位账号下运动员信息
        * getUnitAthletes(action: AnyAction, effect: EffectsCommandMap) {
            console.log(action.payload);
            let res = yield getUnitAthletesdata(action.payload);
            if (res) {
                console.log(res);
            }
        }
    }
}

export default ATHLETES_MESSAGE_MODEL;
