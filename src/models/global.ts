import { Reducer } from 'redux';

export interface GlobalModelState {
    showModal?: boolean;
}

export interface GlobalModelType {
    namespace: 'global',
    state: GlobalModelState,
    effects: {

    },
    reducers: {
        closeModal: Reducer<GlobalModelState>;
    }
}

const GlobalModel: GlobalModelType = {
    namespace: 'global',
    
    state: {
        showModal: true
    },
    effects: {

    },
    reducers: {
        closeModal(state, { payload }) {
            return {
                ...state,
                showModal: payload
            }
        }
    }
}

export default GlobalModel;
