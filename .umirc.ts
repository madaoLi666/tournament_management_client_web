import { IConfig } from 'umi-types';

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
        dynamicImport: { webpackChunkName: true },
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
