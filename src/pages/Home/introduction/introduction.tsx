import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, Input, message, Modal, Skeleton } from 'antd';
import { Dispatch, connect } from 'dva';
import { ConnectState } from '@/models/connect';
import IntroductionFooter from '@/pages/Home/introduction/components/introductionFooter';
import IntroductionContent from '@/pages/Home/introduction/components/introductionContent';
import { router } from 'umi';
import { EditOutlined } from '@ant-design/icons';

interface IntroductionProps {
  dispatch: Dispatch;
  matchData?: any;
  unit_account?: number;
  unitId?: number;
  history: any;
  userId?: number;
}

function Introduction(props: IntroductionProps) {
  const { dispatch, matchData, history, unit_account, unitId, userId } = props;

  // 预加载的DOM
  const [img, setImg] = useState('');
  const [isLoad, setLoad] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showModal2 = () => {
    setIsModalVisible2(true);
  };
  const handleOk2 = () => {
    setIsModalVisible2(false);
  };
  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };
  const onSearch = (value: string) => {
    if (value === '950308') {
      handleOk2();
      router.push('/enroll/choiceTeam/' + matchData.id);
    } else {
      message.error('邀请码错误');
    }
  }

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
    if(matchData.id && matchData.id === 28) {
      showModal2();
    }
  }, [history.location, matchData]);

  // 报名处理函数
  const handleEnroll = () => {
    if (matchData.id === undefined || matchData.id === -1) {
      message.error('[introduction] id is null:' + JSON.stringify(matchData.id));
      return;
    }
    if (!userId) {
      // 一次请求都没发生过，即没有登录
      message.info('请先登录账号后进行报名');
      router.push('/login');
      return;
    }
    if (unit_account === 0) {
      message.warning('请先补全参赛单位信息后再进行报名！');
      router.push({
        pathname: '/complete',
        query: {
          type: 0,
        },
      });
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
            if (matchData.id === 29) {
              showModal();
            }else {
              router.push('/enroll/choiceTeam/' + matchData.id);
            }
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
      message.error('[introduction]enroll unit_account error:' + JSON.stringify(unit_account));
      console.error('[introduction]enroll unit_account error:' + JSON.stringify(unit_account));
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
            imgDom={<img src={matchData.image} alt="" />}
          />
        ) : (
          <Skeleton key="skeleton" active />
        )}
        {/*这里是隐藏加载图片,img原本是空字符,等待useEffect中赋值后,这里开始渲染*/}
        <Modal
        title=""
        visible={isModalVisible}
        footer={null}
        onOk={handleOk2}
        onCancel={handleCancel}
      >
        <p>此赛事为邀请赛，请提交邀请码验证参赛！</p>
        <Input.Search onSearch={onSearch} prefix={<EditOutlined />} enterButton="验证" placeholder="邀请码" />
      </Modal>
      <Modal
        title="比赛延长通知"
        visible={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
      >
        <p>各单位：
原定2020年12月18-20日在惠州市举行的2020年广东省滑板锦标赛，经组委会研究决定，现延期至2021年1月15-17日举行，报名时间顺延至2021年1月8日23：59截止。具体事宜请关注“广省省社会体育网”、“广东省社会体育中心微信公众号”等网络媒介，并互相转告，不便之外，敬请谅解。</p>
      </Modal>
        <IntroductionFooter matchData={matchData} />
        <div className={styles['hidden']}>
          {img === '' ? null : <img src={img} onLoad={onLoad.bind(event)} alt="" />}
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
    userId: user.id,
    unit_account: user.unitAccount,
  };
})(Introduction);
