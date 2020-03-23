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
}

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
    content: <UnitMessage />,
  },
  {
    title: '完成',
    content: <CompleteResult />,
  },
];

function StepForm(props: StepFormProps) {
  const { history, dispatch } = props;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const currentStep = history.location.pathname.split('/').pop();
    if (isNaN(currentStep) || currentStep < 0 || currentStep > 2) {
      message.error('请检查页面地址是否正确!');
      return;
    }
    // 收起左侧栏
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: true,
    });
    setCurrent(Number(currentStep));
  }, [history.location.pathname]);

  return (
    <div className={styles.main}>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className={styles['steps-content']}>{steps[current].content}</div>
      {/*<div className="steps-action">*/}
      {/*  {current < steps.length - 1 && (*/}
      {/*    <Button type="primary" onClick={() => router.push(`/complete/${current + 1}`)}>*/}
      {/*      Next*/}
      {/*    </Button>*/}
      {/*  )}*/}
      {/*  {current === steps.length - 1 && (*/}
      {/*    <Button type="primary" onClick={() => message.success('Processing complete!')}>*/}
      {/*      Done*/}
      {/*    </Button>*/}
      {/*  )}*/}
      {/*  {current > 0 && (*/}
      {/*    <Button style={{ margin: 8 }} onClick={() => router.push(`/complete/${current - 1}`)}>*/}
      {/*      Previous*/}
      {/*    </Button>*/}
      {/*  )}*/}
      {/*</div>*/}
    </div>
  );
}

const mapStateToProps = ({ router, loading }: ConnectState) => {
  return {
    loading: loading.global,
    // current: Number(currentStep),
  };
};

export default connect()(StepForm);
