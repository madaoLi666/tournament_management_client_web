import { Dispatch, AnyAction } from 'redux';
import { Route } from 'react-router';
import { RouterTypes } from 'umi';
import { EnrollModelState } from '@/models/enrollModel';
import { UserModelState } from '@/models/userModel';
import { LoginModelState } from '@/pages/Login/models/loginModel';
import { RegisterModelState } from '@/pages/Login/models/registerModel';
import { GameListModelState } from '@/models/gameListModel';
import { UnitModelState } from '@/models/unitModel';
import { GlobalModelState } from '@/models/globalModel';
import { AccountModelState } from '@/pages/PersonBackground/models/accountModel';

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    login?: boolean; // 登录model
    register?: boolean; // 注册model
    enroll: boolean;
    user?: boolean;
    gameList?: boolean;
    unit?: boolean;
    global?: boolean;
    account?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  enroll: EnrollModelState;
  user: UserModelState;
  login: LoginModelState;
  register: RegisterModelState;
  gameList: GameListModelState;
  unit: UnitModelState;
  global: GlobalModelState;
  account: AccountModelState;
  router: any;
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
