import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

export default function LoginLayout(props: any) {

  return (
    <Layout className={styles['login-layout']}>
      <Header className={styles['header']}>
        <div>
        <strong>轮滑赛事辅助系统平台</strong>
        </div>
      </Header>
      <Content className={styles['container']}>
        {props.children}
      </Content>
      <Footer className={styles['footer']}>
        This is a footer
      </Footer>
    </Layout>
  );
}
