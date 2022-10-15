import React, { useEffect } from 'react';
import { Layout, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Dispatch } from 'redux';
import styles from './index.less';
import HeaderMsg from '@/components/Header/HeaderMsg';
import FooterMsg from '@/components/Footer/FooterMsg';
import { ConnectState } from '@/models/connect';

const { Content, Footer } = Layout;

interface EnrollLayoutProps {
  dispatch: Dispatch;
  children: React.ReactNode;
  matchId: string;
  amateurExaminationData: any;
}

function AmateurEnrollLayout(props: EnrollLayoutProps) {
  const { dispatch, amateurExaminationData } = props;
  const token = window.localStorage.getItem('TOKEN');

  useEffect(() => {
    if (token !== null) {
      // 获取账号信息
      dispatch({
        type: 'user/getAccountData',
        callback: (data: any) => {
          if (data === undefined) {
            // 这里应该漏了一个处理
            return;
          }
          if (amateurExaminationData.id) {
            // 获取开设的考评
            // 获取单位下的运动员数据
          } else {
            message.error('请选择赛事');
            router.push('/home/amateurlevel');  
          }
        },
      });
    } else {
      message.warning('请登陆账号后进行报名!');
      window.localStorage.clear();
      dispatch({
        type: 'user/clearState',
        payload: '',
      });
      dispatch({
        type: 'enroll/clearState',
        payload: '',
      });
      router.push('/login');
    }
  }, []);

  return (
    <Layout className={styles.enroll}>
      <HeaderMsg />
      <div className={styles.matchName}>
        {amateurExaminationData ? <div>{amateurExaminationData.name}</div> : <span>loading</span>}
      </div>
      <Content className={styles.content}>{props.children}</Content>

      <Footer>
        <FooterMsg />
      </Footer>
    </Layout>
  );
}

const mapStateToProps = ({ router, amateur }: ConnectState) => {
  return {
    amateurExaminationData: amateur.amateurExaminationData
  };
};

export default connect(mapStateToProps)(AmateurEnrollLayout);
