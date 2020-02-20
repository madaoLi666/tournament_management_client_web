import React from 'react';
import { Layout } from 'antd';
import styles from './login.less';
import FooterMsg from '@/components/Footer/FooterMsg';

const { Header, Content, Footer } = Layout;

export default function LoginLayout(props: any) {
  const { children } = props;

  return (
    <Layout className={styles.login_layout}>
      <Header className={styles.header}>
        <p>
          <img src={require('@/assets/logo.png')} alt="" />
          <strong>轮滑赛事辅助系统平台</strong>
        </p>
      </Header>

      <Content className={styles.content}>{children}</Content>

      <Footer>
        <FooterMsg />
      </Footer>
    </Layout>
  );
}
