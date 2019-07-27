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
  {
    path: '/', component: require('../pages/index.tsx').default, isRender: false, name: ''
  },
];

export const MAIN_PATH = '/';
export default uRoutes;
