import * as React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './UserLayout.css';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

export default function LoginLayout(props: any) {

  return (
    <Layout>
      <Header className={styles.header}>
        This is a header
      </Header>
      <Content className={styles.container}>
        {props.children}
      </Content>
      <Footer className={styles.footer}>
        This is a footer
      </Footer>
    </Layout>
  );
}
