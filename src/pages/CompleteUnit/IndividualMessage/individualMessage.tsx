import React, { useRef } from 'react';
import styles from '../index.less';
import { connect, Dispatch } from 'dva';
import LoginBlock from '@/components/LoginBlock/loginBlock';
import { Button, Form, Input } from 'antd';
import IdForm from '@/components/athleteForm/components/idForm';
import { router } from 'umi';

const { Item } = Form;

// 表单样式
const BasicInfoSupplementStyle = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: { span: 6 },
    lg: { span: 7 },
    xl: { span: 6 },
    xxl: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
  colon: true,
};

interface IndividualMessageProps {
  dispatch: Dispatch;
  // next: any;
}

function IndividualMessage(props: IndividualMessageProps) {
  // const [form] = Form.useForm();
  // const { next } = props;
  const formRef = useRef<any>({});

  const onFinish = (value: any) => {
    console.log(value);
    // next();
    router.push('/complete/1');
  };

  return (
    <LoginBlock>
      <Form onFinish={onFinish} ref={formRef} {...BasicInfoSupplementStyle} labelAlign="right">
        <Item label="姓名" name="name" rules={[{ required: true, message: '请输入真实姓名' }]}>
          <Input />
        </Item>
        <IdForm isAdd={true} formRef={formRef} />
        <Button type="primary" htmlType="submit" block>
          下一步
        </Button>
      </Form>
    </LoginBlock>
  );
}

export default connect()(IndividualMessage);
