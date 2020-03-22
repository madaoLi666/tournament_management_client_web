import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Button, message, Steps } from 'antd';
import IndividualMessage from '@/pages/CompleteUnit/IndividualMessage/individualMessage';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';

const { Step } = Steps;

interface StepFormProps {
  loading: boolean;
  current: number;
}

// 步骤选项
const steps = [
  {
    title: '完善基本信息',
    content: <IndividualMessage />,
  },
  {
    title: '选择您的身份',
    content: 'Second-content',
  },
  {
    title: '完善单位信息',
    content: 'Last-content',
  },
];

function StepForm(props: StepFormProps) {
  // const { current } = props;
  const [current, setCurrent] = useState(0);

  // TODO 增加useEffect 用history 调用 setCurrent

  if (isNaN(current) || current < 0 || current > 2) {
    message.error('请检查页面地址是否正确!');
    return <span>loading</span>;
  } else {
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => router.push(`/complete/${current + 1}`)}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: 8 }} onClick={() => router.push(`/complete/${current - 1}`)}>
              Previous
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ router, loading }: ConnectState) => {
  return {
    loading: loading.global,
    // current: Number(currentStep),
  };
};

export default connect()(StepForm);
