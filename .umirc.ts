import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  //
  routes:[
    // 登陆页面
    {
      path: '/login', name: '登陆模块',
      Routes: ['./src/layouts/UserLayout.tsx'],
      routes: [
        { path: '/login', component: './Login/Login.tsx', name: '个人登陆页面'},
        { path: '/login/register', component: './Login/Register.tsx', name: '个人注册页面' },
        { path: '/login/bindUnit', component: './Login/BindUnit.tsx', name: '绑定单位页面' },
        { path: '/login/mobileValidate', component: './Login/MobileValidate.tsx', name: '手机验证页面' },
        { path: '/login/infoSupplement', component: './Login/BasicInfoSupplement.tsx', name: '运动员信息补全' },
        { path: '/login/setRole', component: './Login/SetRole.tsx', name: '设置角色' }
      ],
    },
    // 报名页面
    { path: '/enroll', exact: true, routes: [{path: './', component: './Enroll/Main.tsx'},] },
    // 主用户界面 - 这个位置是动态设置的
    {
      path: '/user',
      Routes: ['./src/layouts/BasicLayout.tsx','./src/pages/Authorized/Authorized.tsx'],
      routes: []
    },
    // 主页
    { path: '/home', exact: true, Routes: ['./src/layouts/HomeLayout.tsx'],
      routes: [
        { path: '/home', component: './Home/index.tsx', name: '主页' }
      ]
    }
  ],
  treeShaking: true,
  runtimePublicPath:true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'userEntryPage',
      dll: true,
      headScripts: [
        {src: 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'}
      ],

    }],
  ]
};

export default config;
