import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Layout, Menu } from 'antd';
import FooterMsg from '@/components/Footer/FooterMsg';
import HeaderMsg from '@/components/Header/HeaderMsg';
import { Dispatch, connect } from 'dva';
import { router } from 'umi';
import {
  CrownOutlined,
  HeatMapOutlined,
  ProjectOutlined,
  WechatOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Content, Footer } = Layout;

interface HomeLayoutProps {
  children: React.ReactNode;
  dispatch: Dispatch;
}

const menuArr: Array<object> = [
  { name: '主页', key: 'home', path: '' },
  { name: '自由式轮滑', key: 'f', path: '' },
  { name: '速度轮滑', key: 's', path: '' },
  { name: '轮滑球', key: 'b', path: '' },
];

function HomeLayout(props: HomeLayoutProps) {
  const [currentMenu, setCurrentMenu] = useState('home');

  const handleChangeMenu = (e: any) => {
    setCurrentMenu(e.key);
    if (e.key === 'home') {
      router.push('/home');
    } else {
      router.push('/home/temp');
    }
  };

  useEffect(() => {
    const token = window.localStorage.getItem('TOKEN');
    const { dispatch } = props;

    dispatch({
      type: 'gameList/getGameList',
      callback: (data: any) => {
        if (data !== undefined && token !== null) {
          dispatch({ type: 'user/getAccountData' });
        }
      },
    });
  }, []);

  return (
    <Layout className={styles.homeLayout}>
      <HeaderMsg />

      <Content className={styles.content}>
        <div className={styles.menu}>
          <Menu
            onClick={handleChangeMenu}
            selectedKeys={[currentMenu]}
            mode={'horizontal'}
          >
            <Menu.Item key={'home'}>
              <HomeOutlined />
              主页
            </Menu.Item>
            <Menu.Item key={'competition'}>
              <CrownOutlined />
              赛事
            </Menu.Item>
            <Menu.Item key={'practice'}>
              <ProjectOutlined />
              培训
            </Menu.Item>
            <Menu.Item key={'level'}>
              <HeatMapOutlined />
              业余等级
            </Menu.Item>
            <Menu.Item key={'small_program'}>
              <WechatOutlined />
              小程序
            </Menu.Item>
          </Menu>
        </div>
        <div className={styles.homeContent}>{props.children}</div>
      </Content>
      <Footer>
        <FooterMsg />
      </Footer>
    </Layout>
  );
}

export default connect()(HomeLayout);
