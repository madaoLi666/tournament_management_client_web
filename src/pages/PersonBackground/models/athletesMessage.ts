import { AnyAction } from 'redux';
import { Model, EffectsCommandMap } from 'dva';

export interface AthletesMessage {

}

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
        // 获取运动员信息
    }
}

export default ATHLETES_MESSAGE_MODEL;
