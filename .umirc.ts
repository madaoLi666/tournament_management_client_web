import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  //
  routes:[
    // 登陆页面 fix
    {
      path: '/login', name: '登陆模块',
      Routes: ['./src/layouts/UserLayout.tsx'],
      routes: [
        { path: '/login', component: './Login/Login.tsx', name: '个人登陆页面'},
        { path: '/login/register', component: './Login/Register.tsx', name: '个人注册页面' },
        { path: '/login/bindUnit', component: './Login/BindUnit.tsx', name: '绑定单位页面' },
        { path: '/login/mobileValidate', component: './Login/MobileValidate.tsx', name: '手机验证页面' }
      ],
    },
    // 报名页面 fix
    { path: '/enroll', exact: true, routes: [{path: './', component: './Enroll/Main.tsx'},] },
    // 主用户界面 - 这个位置是动态设置的
    {
      path: '/',
      Routes: ['./src/layouts/BasicLayout.tsx'],
      routes: []
    },
  ],
  treeShaking: true,
  publicPath: '/public',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'userEntryPage',
      dll: true,

      // routes: {
      //   exclude: [
      //     /models\//,
      //     /services\//,
      //     /model\.(t|j)sx?$/,
      //     /service\.(t|j)sx?$/,
      //     /components\//,
      //   ],
      // }
    }],
  ]
};

export default config;
