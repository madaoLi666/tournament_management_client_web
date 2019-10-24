import { Dispatch, AnyAction } from 'redux';
import { Route } from 'react-router';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';

export interface Loading {
    global: boolean;
    effects: { [key: string]: boolean | undefined };
    models: {
        global?: boolean;
    }
}

export interface ConnectState {
    loading: Loading;
    global: GlobalModelState
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
    dispatch?: Dispatch<AnyAction>;
}