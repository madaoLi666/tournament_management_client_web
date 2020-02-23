import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, message, Modal, Skeleton } from 'antd';
import { Dispatch, connect } from 'dva';
import { ConnectState } from '@/models/connect';
import IntroductionFooter from '@/pages/Home/introduction/components/introductionFooter';
import IntroductionContent from '@/pages/Home/introduction/components/introductionContent';
import { router } from 'umi';

interface IntroductionProps {
  dispatch: Dispatch;
  matchData?: any;
  unit_account?: number;
  unitId?: number;
  history: any;
}

function Introduction(props: IntroductionProps) {
  const { dispatch, matchData, history, unit_account, unitId } = props;

  // 预加载的DOM
  const [img, setImg] = useState('');
  const [isLoad, setLoad] = useState(false);

  // 预加载轮播图图片加载完成后的执行,表明已经加载完成,可以渲染原本内容了
  const onLoad = () => {
    setLoad(true);
  };

  // 获取路径参数
  useEffect(() => {
    if (history.location === undefined) {
      message.error('[introduction]location is undefined');
      return;
    }
    if (
      history.location.query.name === undefined &&
      history.location.pathname === '/home/introduction'
    ) {
      message.error('[introduction]请确保网址输入正确');
      return;
    }
    if (matchData === undefined || matchData === null) {
      return;
    }
    setImg(matchData.image);
  }, [history.location, matchData]);

  // 报名处理函数
  const handleEnroll = () => {
    if (matchData.id === undefined || matchData.id === -1) {
      message.error(
        '[introduction] id is null:' + JSON.stringify(matchData.id),
      );
      return;
    }
    if (unit_account === 0) {
      router.push('/enroll/individual');
      return;
    }
    if (unit_account === 1) {
      message.info('本系统暂不支持个人报名，请联系您的单位进行报名');
      return;
    }
    // 剩下 unit_account === 2的情况
    if (unit_account === 2) {
      dispatch({
        // 先检验该队伍是否能参赛
        type: 'enroll/getEnrollLimit',
        payload: { matchdata_id: matchData.id, unitdata_id: unitId },
        callback: (data: boolean) => {
          if (data) {
            dispatch({
              type: 'enroll/modifyCurrentMatchId',
              payload: { matchId: matchData.id },
            });
            router.push('/enroll/choiceTeam');
          } else {
            Modal.warning({
              title: '您的单位暂时报名不了本场赛事',
              content:
                '此为广东省轮滑运动协会会员单位杯，贵单位注册的名称为非会员，不能参赛，感谢您们的参与！如是会员需更正名称，请在个人中心中更新单位信息后 再进行报名。',
              okText: '确定',
            });
          }
        },
      });
    } else {
      // 如果连2都不等于，那传入错误
      message.error(
        '[introduction]enroll unit_account error:' +
          JSON.stringify(unit_account),
      );
      console.error(
        '[introduction]enroll unit_account error:' +
          JSON.stringify(unit_account),
      );
    }
  };

  if (!matchData) {
    return <div />;
  } else {
    return (
      <div>
        {isLoad ? (
          <IntroductionContent
            handleEnroll={handleEnroll}
            matchData={matchData}
          />
        ) : (
          <Skeleton key="skeleton" active />
        )}
        {/*这里是隐藏加载图片,img原本是空字符,等待useEffect中赋值后,这里开始渲染*/}
        <IntroductionFooter matchData={matchData} />
        <div className={styles['hidden']}>
          {img === '' ? null : (
            <img src={img} onLoad={onLoad.bind(event)} alt="" />
          )}
        </div>
      </div>
    );
  }
}

export default connect(({ gameList, enroll, user, router }: ConnectState) => {
  const matchName = router.location.query.name;
  const list = gameList.gameList;
  let matchData: any = undefined;
  // 作数据的处理,返回指定的比赛信息
  if (list && list.length !== 0) {
    let index = -1;
    for (let i = list.length - 1; i >= 0; i--) {
      if (matchName === list[i].name) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      // 这边要暂时写死，因为需要修改数据库中的图片路径才行
      if (list[index].id === 12) {
        list[index].image = 'http://cos.gsta.top/sudulunhua.jpeg';
      } else if (list[index].id === 13) {
        list[index].image = 'http://cos.gsta.top/lunhuaqiu.jpeg';
      } else if (list[index].id === 14) {
        list[index].image = 'http://cos.gsta.top/ziyoushi.jpeg';
      } else if (list[index].id === 21) {
        list[index].image = 'http://cos.gsta.top/zhiyoushi-1.png';
      }
      matchData = list[index];
    }
  }

  return {
    matchData: matchData,
    unitId: enroll.unitInfo.id,
    unit_account: user.unitAccount,
  };
})(Introduction);
