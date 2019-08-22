import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';
import { addAthleteInfo } from '@/services/register';
import { getUnitAthletesdata, addplayer } from '@/services/athlete';

const ATHLETES_MODEL:Model = {
    namespace: 'athletes',
    state: {
      
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
        },
        //  添加运动员信息
        * addAthletes(action: AnyAction, effect: EffectsCommandMap) {
            yield console.log(action);
        }
    }
}

export default ATHLETES_MODEL;
