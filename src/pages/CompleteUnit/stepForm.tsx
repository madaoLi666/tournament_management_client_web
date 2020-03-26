import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, message, Steps } from 'antd';
import IndividualMessage from '@/pages/CompleteUnit/IndividualMessage/individualMessage';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
import SetRole from '@/pages/CompleteUnit/SetRole/setRole';
import UnitMessage from '@/pages/CompleteUnit/UnitMessage/unitMessage';
import CompleteResult from '@/pages/CompleteUnit/components/completeResult';

const { Step } = Steps;

interface StepFormProps {
  history: any;
  dispatch: Dispatch;
  loading: boolean;
  userData: any;
  unitData: any;
}

function StepForm(props: StepFormProps) {
  const { history, dispatch, loading, userData, unitData } = props;
  const [current, setCurrent] = useState(0);

  // 步骤选项
  const steps = [
    {
      title: '完善基本信息',
      content: <IndividualMessage />,
    },
    // {
    //   title: '选择您的身份',
    //   content: <SetRole />,
    // },
    {
      title: '完善单位信息',
      content: <UnitMessage history={history} />,
    },
    {
      title: '完成',
      content: <CompleteResult />,
    },
  ];
  // 13428362404
  useEffect(() => {
    const currentStep = history.location.query.type;
    const route = history.location.pathname;
    if (route === '/complete' && (isNaN(currentStep) || currentStep < 0 || currentStep > 2)) {
      message.error('请检查页面地址是否正确!');
      return;
    }
    // 要加个 !loading，表示数据已经加载完毕
    if (!loading) {
      if (!userData.length || userData.length === 0) {
        router.push({
          pathname: '/complete',
          query: {
            type: 0,
          },
        });
        setCurrent(0);
      } else if (!unitData.length || unitData.length === 0) {
        router.push({
          pathname: '/complete',
          query: {
            type: 1,
          },
        });
        setCurrent(1);
      } else {
        router.push({
          pathname: '/complete',
          query: {
            type: 2,
          },
        });
        setCurrent(2);
      }
      // 收起左侧栏
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload: true,
      });
    }
  }, [
    history.location.pathname,
    dispatch,
    history.location.query.type,
    loading,
    unitData,
    userData,
  ]);

  return (
    <div className={styles.main}>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className={styles['steps-content']}>{steps[current].content}</div>
    </div>
  );
}

const mapStateToProps = ({ user, loading }: ConnectState) => {
  return {
    loading: loading.global,
    unitData: user.unitData,
    userData: user.athleteData,
  };
};

export default connect(mapStateToProps)(StepForm);
