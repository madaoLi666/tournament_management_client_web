import React,{ useEffect } from 'react';
import router from 'umi/router';
// @ts-ignore
import styles from './index.less';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

export default function LoginLayout(props: any) {

  const { children } = props;

  useEffect(() => {
    const LOGIN_PATH:string = '/login';
    const token = window.localStorage.getItem('TOKEN');
    const pathName = window.location.pathname;
    if(token === null || token === undefined ) {
      if(pathName !== LOGIN_PATH){
        router.push(LOGIN_PATH);
      }
    }
  });

  return (
    <Layout className={styles['login-layout']} style={{ minHeight: '100vh' }}>
      <Header className={styles.header}>
        <p><strong>轮滑赛事辅助系统平台</strong></p>
      </Header>

      <Content className={styles.content} >
        {children}
      </Content>

      <Footer className={styles.footer}>
        This is a footer
      </Footer>
    </Layout>
  );
}
