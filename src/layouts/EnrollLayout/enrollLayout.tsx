import React, { useEffect } from 'react';
import { Layout, message, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Dispatch } from 'redux';
import styles from './index.less';
import HeaderMsg from '@/components/Header/HeaderMsg';
import FooterMsg from '@/components/Footer/FooterMsg';

const { Content, Footer } = Layout;

interface EnrollLayoutProps {
  dispatch: Dispatch;
  children: React.ReactNode;
}

function EnrollLayout(props: EnrollLayoutProps) {
  return (
    <Layout className={styles.enroll}>
      <HeaderMsg />

      <Content className={styles.content}>{props.children}</Content>

      <Footer>
        <FooterMsg />
      </Footer>
    </Layout>
  );
}

export default connect()(EnrollLayout);
