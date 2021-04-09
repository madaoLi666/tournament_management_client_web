import React, { useEffect } from 'react';
import styles from './index.less';
import { Layout } from 'antd';
import FooterMsg from '@/components/Footer/FooterMsg';
import HeaderMsg from '@/components/Header/HeaderMsg';
import { Dispatch, connect } from 'dva';

const { Content, Footer } = Layout;

interface HomeLayoutProps {
  children: React.ReactNode;
  dispatch: Dispatch;
}

function HomeLayout(props: HomeLayoutProps) {
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
    <Layout style={{ backgroundColor: 'white' }} className={styles.homeLayout}>
      <HeaderMsg />

      <Content className={styles.content}>
        <div className={styles.homeContent}>{props.children}</div>
      </Content>
      <Footer>
        <FooterMsg />
      </Footer>
    </Layout>
  );
}

export default connect()(HomeLayout);
