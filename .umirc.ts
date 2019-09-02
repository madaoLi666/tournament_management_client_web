import { IConfig } from 'umi-types';
import * as webpack from 'webpack';
import * as IWebpackChainConfig from 'webpack-chain'
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

// ref: https://umijs.org/config/
const config: IConfig =  {
  //
  routes:[
    // 主页
    { path: '/home', Routes: ['./src/layouts/HomeLayout.tsx'],
      routes: [
        { path: '/home', component: './Home/index.tsx', name: '主页' },
        { path: '/home/introduction', component: './Home/Introduction.tsx', name: '赛事介绍页面' },
      ]
    },
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
    // 报名模块
    { path: '/enroll',
      Routes: ['./src/layouts/EnrollLayout.tsx','./src/pages/Authorized/Authorized.tsx'],
      routes: [
        { path: '/enroll/editUnitInfo', component: './Enroll/EditUnitInfo.tsx', name: '参赛单位信息'},
        { path: '/enroll/participants', component: './Enroll/ParticipantsAthleteList.tsx', name: '编辑参赛运动员信息'},
        { path: '/enroll/individual', component: './Enroll/IndividualEnroll.tsx', name: '运动员个人报名'},
        { path: '/enroll/team', component: './Enroll/TeamEnroll.tsx', name: '运动员个人报名'}
      ]
    },
    // 主用户界面 - 这个位置是动态设置的
    {
      path: '/user',
      Routes: ['./src/layouts/BasicLayout.tsx','./src/pages/Authorized/Authorized.tsx'],
      routes: []
    },
    { path: '/', redirect: '/home' }
  ],
  treeShaking: true,
  chainWebpack(config: any) {
    if(process.env.NODE_ENV !== 'development'){
      config.optimization.splitChunks({
        chunks: 'async',
        minSize: 3000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          antdesigns: {
            name: 'antdesigns',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            priority: -10,
          },
          icons: {
            name: 'icons',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
            priority: -9,
          },
        },
      });
      config.plugin('ignore')
        .use(webpack.IgnorePlugin,[/^\.\/locale$/,/moment$/]);
      // config.plugin('image')
      //   .use(ImageminPlugin,[{
      //     disable: process.env.NODE_ENV === 'development',
      //     test: /\.(jpe?g|png|svg|gif)$/i,
      //     optipng: {
      //       optimizationLevel: 9
      //     }
      //   }]);
      config.module
        .rule('compile')
        .test(/\.(js|jsx)$/)
        .include
        .add('/src')
        .end()
        .use('babel')
        .loader('babel-loader')
        .options({
          presets: ["react","typescript","env"],
          plugins: [
            ["import", [{libraryName: "antd", style: true}]]
          ],
          // "customName": require('path').resolve(__dirname, './customName.js')
        })
    }
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'userEntryPage',
      dll: true,
      // chunks: ['antdesigns', 'icons','umi'],
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }]
  ]
};

export default config;
