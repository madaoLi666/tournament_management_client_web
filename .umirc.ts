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
      routes: [{ path: '/login', component: './Login/Login.tsx' }],
    },
    { path: '/', redirect: '/login' },
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
