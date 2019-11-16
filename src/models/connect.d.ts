import { Dispatch, AnyAction } from 'redux';
import { Route } from 'react-router';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { EnrollModelState } from '@/models/enroll';
import { GameListModelState } from './gamelist';
import { UserModelState } from './user';
import { UnitModelState } from '@/models/unit';

export interface Loading {
    global: boolean;
    effects: { [key: string]: boolean | undefined };
    models: {
        global?: boolean;
        enroll?: boolean;
        gameList?: boolean;
        user?: boolean;
        unit?: boolean;
    }
}

export interface ConnectState {
    loading: Loading;
    global: GlobalModelState;
    enroll: EnrollModelState;
    gameList: GameListModelState;
    user: UserModelState;
    unit: UnitModelState;
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
    dispatch?: Dispatch<AnyAction>;
}
