import * as React from 'react';
import { Layout } from 'antd';
// @ts-ignore
import styles from './index.less';
const { Header, Content, Footer } = Layout;

export default function SignUP(props: any) {

  return (
    <div className={styles['enroll-layout']}>
      <Layout>
        <Header className={styles.header}>
          欢迎进入xxx赛事报名通道
        </Header>
        <Content className={styles.content}>
          {props.children}
        </Content>
        <Footer className={styles.footer}>
          This is Footer
        </Footer>
      </Layout>
    </div>
  );
}
