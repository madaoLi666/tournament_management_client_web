import React,{ useEffect } from 'react';
import { Layout, message, Button, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Dispatch } from 'redux';
// @ts-ignore
import styles from './index.less';

const { Header, Content, Footer } = Layout;

function EnrollLayout(props: {dispatch: Dispatch, currentGameData: any,children: React.ReactNode}) {

  const { currentGameData } = props;
  const token = window.localStorage.getItem('TOKEN');


  useEffect(() => {
    const { dispatch } = props;
    const matchId = Number(window.localStorage.getItem('MATCH_ID'));
    if(token !== null){
      // 获取账号信息
      dispatch({type: 'user/getAccountData',
        callback: (data: any) => {
          if(data === undefined) { return; }
          if(matchId !== null) {
            // 修改model中赛事id
            dispatch({type: 'enroll/modifyCurrentMatchId', payload: {matchId: matchId}});
            // 获取赛事规则
            dispatch({type: 'enroll/getIndividualLimitation',payload: {matchId: matchId}});
            dispatch({type: 'enroll/getAllItemInfo',payload: {matchId: matchId}});
            // 获取gameList 拿本场赛事信息
            dispatch({type: 'gameList/getGameList'});
            dispatch({type: 'gameList/getGroupAge', payload: { matchdata: matchId } });
          }else {
            message.error('请选择赛事');
            router.push('/home');
          }
        }
      });
    }else {
      message.warning('登陆过期，请重新登陆');
      window.localStorage.clear();
      dispatch({
        type: 'user/clearstate',
        payload: ''
      });
      dispatch({
        type: 'enroll/clearstate',
        payload: ''
      });
      router.push('/login');
    }
  },[]);

  function exit() {
    window.localStorage.clear();
    props.dispatch({
      type: 'user/clearstate',
      payload: ''
    });
    props.dispatch({
      type: 'enroll/clearstate',
      payload: ''
    });
    router.push('/home');
    message.info('退出登陆成功');
  }

  return (
    <div className={styles['enroll-layout']}>
      <Layout style={{height: '100%'}}>
        <Header className={styles['header']}>
          <div className={styles.header_left}>
            <strong>
              <div>
                <img src={require('@/assets/logo.png')}  alt=""/>
                <span ><a href={"/home"} >轮滑赛事辅助系统平台</a></span>
                &nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <a className={styles.header_block} onClick={() => window.open('https://www.gsta.top/nstatic/react/%E6%8A%A5%E5%90%8D%E6%AD%A5%E9%AA%A4_6fDXGU2.html')} >报名步骤查看</a>
            </strong>
          </div>
          <div className={styles.header_right}>
            {(token === null || token === undefined) ? (
              <div>
                <a onClick={() => router.push('/home')}>主页</a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={() => router.push('/login')} >你好，请登录</a>
              </div>
            ) : (
              <span>
                  <a onClick={() => router.push('/user/list')}>个人中心</a>
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <a onClick={exit}>退出登陆</a>
                </span>
            )}
          </div>
        </Header>
        <Header className={styles.header1}>
          <strong>
            <div className={styles.header_title}>
              <span>
                {currentGameData !== undefined ? currentGameData.name : null}
              </span>
            </div>
          </strong>
        </Header>
        <Content className={styles.content}>
          {props.children}
        </Content>
        <Footer className={styles.footer}>
        <span>广州青苔科技有限公司 版权所有  <a target="_blank" href='http://beian.miit.gov.cn' style={{ color: '#939393'}}>粤ICP备19028504号</a></span>
          <div style={{width: '300px',margin:'0 auto', padding:'20px 0'}}>
            <a
              target="_blank"
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44011802000333"
              style={{display:'inline-block', textDecoration:'none', height: '20px', lineHeight: '20px'}}
            >
              <img src={require('../assets/p.png')} style={{float: 'left'}} alt="" />
              <p style={{float: 'left', height: '20px', lineHeight: '20px', margin: '0px 0px 0px 5px', color: '#939393'}} >
              粤公网安备 44011802000333号</p>
            </a>
          </div>
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
