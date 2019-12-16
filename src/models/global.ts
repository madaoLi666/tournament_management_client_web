import { Reducer } from 'redux';

export interface GlobalModelState {
    showModal?: boolean;
    drawer_visible?: boolean;
  collapsed?: boolean;
}

export interface GlobalModelType {
    namespace: 'global',
    state: GlobalModelState,
    effects: {

    },
    reducers: {
        closeModal: Reducer<GlobalModelState>;
        person_background_drawer: Reducer<GlobalModelState>;
      changeLayoutCollapsed: Reducer<GlobalModelState>;
    }
}

const GlobalModel: GlobalModelType = {
    namespace: 'global',

    state: {
        showModal: true,
        drawer_visible: true,
        collapsed: true
    },
    effects: {

    },
    reducers: {
        changeLayoutCollapsed(state, { payload }) {
          return {
            ...state,
            collapsed: payload
          }
        },
        closeModal(state, { payload }) {
            return {
                ...state,
                showModal: payload
            }
        },
        person_background_drawer(state, { payload }) {
          return {
            ...state,
            drawer_visible: payload
          }
        }
    }
};

export default GlobalModel;
