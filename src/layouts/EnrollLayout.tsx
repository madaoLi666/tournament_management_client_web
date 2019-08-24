import React,{ useEffect } from 'react';
import { Layout, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Dispatch } from 'redux';
// @ts-ignore
import styles from './index.less';

const { Header, Content, Footer } = Layout;

function EnrollLayout(props: {dispatch: Dispatch, children: React.ReactNode}) {


  useEffect(() => {
    const { dispatch } = props;
    const token = window.localStorage.getItem('TOKEN');
    const matchId = window.localStorage.getItem('MATCH_ID');
    if(token !== null){
      dispatch({type: 'user/getAccountData'});
      if(matchId !== null) {
        dispatch({type: 'enroll/modifyCurrentMatchId', payload: {matchId: matchId}});
      }else {
        message.error('请选择赛事');
        router.push('/home');
      }
    }else {
      message.error('登陆过期，请重新登陆');
      router.push('/login');
    }
  });

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
          <span>广州青苔科技有限公司 版权所有  粤ICP备19028504号</span>
        </Footer>
      </Layout>
    </div>
  );
}

export default connect()(EnrollLayout);
