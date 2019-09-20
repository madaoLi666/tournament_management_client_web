import React,{ useEffect } from 'react';
import { Layout, message, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Dispatch } from 'redux';
// @ts-ignore
import styles from './index.less';
import { FaHome } from 'react-icons/fa';

const { Header, Content, Footer } = Layout;

function EnrollLayout(props: {dispatch: Dispatch, currentGameData: any,children: React.ReactNode}) {

  const { currentGameData } = props;



  useEffect(() => {
    const { dispatch } = props;
    const token = window.localStorage.getItem('TOKEN');
    const matchId = Number(window.localStorage.getItem('MATCH_ID'));
    if(token !== null){
      // 获取账号信息
      dispatch({type: 'user/getAccountData'});
      if(matchId !== null) {
        // 修改model中赛事id
        dispatch({type: 'enroll/modifyCurrentMatchId', payload: {matchId: matchId}});
        // 获取赛事规则
        dispatch({type: 'enroll/getIndividualLimitation',payload: {matchId: matchId}});
        dispatch({type: 'enroll/getAllItemInfo',payload: {matchId: matchId}});
        // 获取gameList 拿本场赛事信息
        dispatch({type: 'gameList/getGameList'});
      }else {
        message.error('请选择赛事');
        router.push('/home');
      }
    }else {
      message.error('登陆过期，请重新登陆');
      router.push('/login');
    }
  },[]);

  return (
    <div className={styles['enroll-layout']}>
      <Layout style={{height: '100%'}}>
        <Header className={styles.header}>
          <span>
            {currentGameData !== undefined ? currentGameData.name : null}
          </span>
          <Button type="link" href="/home" style={{float:"right",marginTop:3,padding:'0px 10px 0px'}} >返回主页</Button>
          <FaHome style={{float:"right",marginTop:13,color:'blue'}} href="/home" />
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

export default connect(({enroll, gameList}:any) => {
  const { currentMatchId } = enroll;
  if(gameList.gameList.length !== 0) {
    return {currentGameData:gameList.gameList.filter((v:any) => (v.id ===currentMatchId))[0]};
  }else {
    return {};
  }
})(EnrollLayout);
