import { IRoute } from 'umi-types';
/*
* params
* 必填
* @path - 访问路由
* @component - 组件路径 以'/page'文件夹为起点
* 选填
* @redirect - 重定向路径
* @Routes - 包裹此级中routes组件，需在Routes的组件中配置children
* @routes - 此路径后的子路由
* */
// export interface IRoute {
//   path?: string;
//   component?: string;
//   routes?: IRoute[];
//   Routes?: string[];
//   redirect?: string;
//   [key: string]: any;
// }

const uRoutes:Array<IRoute> = [
  // TODO 这个应写进运动员信息管理
  { path: '/home', component: require('../pages/Home/index.tsx').default, isRender:true, name: '主页' },
  // { path: '/user/personCenter', component: require('../pages/PersonBackground/PersonCenter.tsx').default, isRender: true, name: '个人中心' },
  // { path: '/user/personSetting', component: require('../pages/PersonBackground/PersonSetting.tsx').default, isRender: true, name: '个人设置' },
  // { path: '/user/athletesList', component: require('../pages/PersonBackground/AthletesList.tsx').default, isRender: true, name: '个人中心' },
  // { path: '/user', component: require('../pages/index.tsx').default, isRender: false, name: '' },
  { path: '/user', component: require('../pages/PersonBackground/AthletesList.tsx').default, isRender: true, name: '个人中心' },
];

export const MAIN_PATH = '/user';
export default uRoutes;
