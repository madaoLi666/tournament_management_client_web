import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';

const { Header, Content, Footer } = Layout;

export default function LoginLayout(props: any) {

  const { children } = props;


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
