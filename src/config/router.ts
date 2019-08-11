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
  { path: '/b', component: require('../pages/Enroll/Main.tsx').default, isRender: true, name: '报名模块' },
  // TODO 这个应写进运动员信息管理
  { path: '/athletesList', component: require('../pages/PersonBackground/AthletesList.tsx').default, isRender: true, name: '添加运动员' },
  { path: '/', component: require('../pages/index.tsx').default, isRender: false, name: '' },
];

export const MAIN_PATH = '/';
export default uRoutes;
