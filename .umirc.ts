import { IConfig } from 'umi-types';
import * as webpack from 'webpack';

const config: IConfig = {
  treeShaking: true,
  targets: {
    ie: 11,
  },
  routes: [
    {
      path: '/login',
      Routes: ['./src/layouts/LoginLayout.tsx'],
      routes: [
        { path: '/login', component: './Login/Login.tsx' },
        { path: '/login/register', component: './Login/register.tsx' },
      ],
    },
    {
      path: '/home',
      Routes: ['./src/layouts/HomeLayout/HomeLayout.tsx'],
      routes: [
        { path: '/home', component: './Home/Home.tsx' },
        {
          path: '/home/introduction',
          component: './Home/introduction/introduction.tsx',
        },
        { path: '/home/temp', component: './404.tsx' },
      ],
    },
    {
      path: '/enroll',
      Routes: ['./src/layouts/EnrollLayout/enrollLayout.tsx'],
      routes: [
        {
          path: '/enroll/choiceTeam/:matchId',
          component: './Enroll/choiceTeam/choiceTeam.tsx',
        },
        {
          path: '/enroll/editUnitInfo/:matchId',
          component: './Enroll/unitInfo/unitInfo.tsx',
        },
        {
          path: '/enroll/participants/:matchId',
          component: './Enroll/ParticipantsAthleteList/ParticipantsAthleteList.tsx',
        },
        {
          path: '/enroll/individual/:matchId',
          component: './Enroll/individual/individual.tsx',
        },
        {
          path: '/enroll/team/:matchId',
          component: './Enroll/teamEnroll/teamEnroll.tsx',
        },
        {
          path: '/enroll/showEnroll/:matchId',
          component: './Enroll/showEnroll/showEnroll.tsx',
        },
        {
          path: '/enroll/success/:matchId',
          component: './Enroll/enrollSuccess/enrollSuccess.tsx',
        },
      ],
    },
    {
      path: '/complete',
      Routes: ['./src/layouts/PersonLayout/PersonLayout.tsx'],
      routes: [{ path: '/complete', component: './CompleteUnit/stepForm.tsx' }],
    },
    {
      path: '/user',
      Routes: ['./src/layouts/PersonLayout/PersonLayout.tsx'],
      routes: [
        {
          path: '/user/list',
          component: './PersonBackground/AthleteList.tsx',
          name: '运动员管理',
          icon: 'smile',
        },
        {
          path: '/user/unitAdmin',
          component: './PersonBackground/UnitAdmin/unitAdmin.tsx',
          name: '单位信息管理',
          icon: 'lock',
        },
        {
          path: '/user/account',
          component: './PersonBackground/AccountMessage/accountMessage.tsx',
          name: '账单信息',
          icon: 'account-book',
        },
        {
          path: '/user/operation',
          component: './PersonBackground/OperationLog/operationLog.tsx',
          name: '操作日志',
          icon: 'property-safety',
        },
      ],
    },
    {
      path: '/download',
      routes: [{ path: '/download', component: './Download/staticDownload.tsx', name: '下载' }],
    },
    { path: '/', redirect: '/home' },
  ],
  plugins: [
    ['umi-plugin-antd-icon-config', {}],
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true, loadingComponent: './pages/index.tsx' },
        title: '轮滑赛事辅助系统',
        dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.([tj])sx?$/,
            /service\.([tj])sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};

export default config;
