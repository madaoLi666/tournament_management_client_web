import React from 'react';
import { Layout } from 'antd';
import styles from './login.less';
import FooterMsg from '@/components/Footer/FooterMsg';

const { Header, Content, Footer } = Layout;

const logo = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/img/logo2.png';

export default function LoginLayout(props: any) {
  const { children } = props;

  return (
    <Layout className={styles.login_layout}>
      <Header className={styles.header}>
        <p>
          <strong>体育赛事辅助平台</strong>
        </p>
      </Header>

      <Content className={styles.content}>{children}</Content>

      <Footer>
        <FooterMsg />
      </Footer>
    </Layout>
  );
}
