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
      ],
    },
    {
      path: '/complete',
      Routes: ['./src/layouts/PersonLayout/PersonLayout.tsx'],
      routes: [{ path: '/complete/:stepId', component: './CompleteUnit/stepForm.tsx' }],
    },
    {
      // TODO 加一个Layout检测unitData为空且unitAccount为0的账号
      path: '/user',
      Routes: ['./src/layouts/PersonLayout/PersonLayout.tsx'],
      routes: [
        { path: '/home', component: './Home/Home.tsx', name: '主页', icon: 'home' },
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
      ],
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
