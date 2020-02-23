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
  currentGameData: any;
}

function EnrollLayout(props: EnrollLayoutProps) {
  const { dispatch, matchId, currentGameData } = props;
  const token = window.localStorage.getItem('TOKEN');

  useEffect(() => {
    if (token !== null) {
      // 获取账号信息
      dispatch({
        type: 'user/getAccountData',
        callback: (data: any) => {
          if (data === undefined) {
            return;
          }
          if (matchId !== null) {
            // 修改model中赛事id
            dispatch({
              type: 'enroll/modifyCurrentMatchId',
              payload: { matchId: matchId },
            });
            // 获取赛事规则
            dispatch({
              type: 'enroll/getIndividualLimitation',
              payload: { matchId: matchId },
            });
            dispatch({
              type: 'enroll/getAllItemInfo',
              payload: { matchId: matchId },
            });
            // 获取gameList 拿本场赛事信息
            dispatch({ type: 'gameList/getGameList' });
            dispatch({
              type: 'gameList/getGroupAge',
              payload: { matchdata: matchId },
            });
          } else {
            message.error('请选择赛事');
            router.push('/home');
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
        {currentGameData ? (
          <div>{currentGameData.name}</div>
        ) : (
          <span>loading</span>
        )}
      </div>
      <Content className={styles.content}>{props.children}</Content>

      <Footer>
        <FooterMsg />
      </Footer>
    </Layout>
  );
}

const mapStateToProps = ({ router, gameList }: ConnectState) => {
  const matchId = router.location.pathname.split('/').pop();
  let currentGameData: any;
  if (gameList.gameList && gameList.gameList?.length !== 0) {
    currentGameData = gameList.gameList.filter(
      (v: any) => v.id === Number(matchId),
    )[0];
  }

  return {
    matchId,
    currentGameData,
  };
};

export default connect(mapStateToProps)(EnrollLayout);
