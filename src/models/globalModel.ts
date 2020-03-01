import { Reducer } from 'redux';

export interface GlobalModelState {
  showModal?: boolean;
  collapsed?: boolean;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {};
  reducers: {
    closeModal: Reducer<GlobalModelState>;
    changeLayoutCollapsed: Reducer<GlobalModelState>;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    showModal: true,
    collapsed: true,
  },
  effects: {},
  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    closeModal(state, { payload }) {
      return {
        ...state,
        showModal: payload,
      };
    },
  },
};

export default GlobalModel;
