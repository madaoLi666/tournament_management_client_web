import { Dispatch, AnyAction } from 'redux';
import { Route } from 'react-router';
import { RouterTypes } from 'umi';

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    login?: boolean; // 登录model
    register?: boolean; // 注册model
  };
}

export interface ConnectState {
  loading: Loading;
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
