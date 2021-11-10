import React, { useState } from 'react';
import { Dispatch, connect } from 'dva';
import { router } from 'umi';
import { Form, message, Input, Button, Row, Col } from 'antd';
import LoginBlock from '@/components/LoginBlock/loginBlock';

import { checkEmail } from '@/utils/regulars';
import styles from './components/register/index.less';
import { resetPassword } from '@/services/registerServices'

interface IProp {
  dispatch: Dispatch
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 18,
      offset: 6,
    },
  },
};

function ResetPassword(props: IProp) {

  const { dispatch } = props;
  const [form] = Form.useForm()
  const [timeInterval, setTimeInterval] = useState(0);
  const [loading, setLoading] = useState(false);

  // 发送邮箱验证码
  const sendCode = () => {
    const email = form.getFieldValue('email');
    if (email === undefined || !checkEmail.test(email)) {
      message.warning('请先输入您的邮箱');
      return;
    }
    dispatch({
      type: 'register/sendEmailCode',
      payload: email,
    });
    const timeInterval: number = 60000;
    setTimeInterval(timeInterval);
    // 计时 用于防止用户多次发送验证码s
    let i = setInterval(() => {
      setTimeInterval(timeInterval => {
        if (timeInterval === 0) {
          clearInterval(i);
          return 0;
        }
        return timeInterval - 1000;
      });
    }, 1000);
  };

  const handleFinish = (values: any) => {
    setLoading(true);
    const requestData = {
      email: values.email,
      emailcode: values.emailVerificationCode,
      password: values.password
    }
    resetPassword(requestData).then((res: any) => {
      if(res) {
        message.success('密码重置成功');
        router.push('/login');
      }
    })
  }

  return (
    <LoginBlock>
      <h1><b>密码找回</b></h1>
      <Form
        {...formItemLayout}
        form={form}
        name="restpassword"
        onFinish={handleFinish}
      >
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            {
              type: 'email',
              message: '请输入正确的邮箱格式!',
            },
            {
              required: true,
              message: '请输入您的邮箱!',
            },
          ]}
        >
          <Input placeholder={'请输入您的邮箱'} />
        </Form.Item>
        <Form.Item label="邮箱验证码" className={'emailCode'}>
          <Row gutter={8}>
            <Col span={14}>
              <Form.Item
                name="emailVerificationCode"
                noStyle
                rules={[
                  {
                    required: true,
                    message: '请输入您获得的验证码!',
                  },
                ]}
              >
                <Input placeholder="点击右侧获取验证码" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Button
                type="primary"
                onClick={sendCode}
                disabled={timeInterval !== 0}
              >
                {timeInterval === 0 ? (
                  <span>获取验证码</span>
                ) : (
                  <span>{timeInterval / 1000}秒</span>
                )}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
            {
              min: 10,
              message: '密码长度至少10位',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder={'密码长度至少10位'} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请再次输入密码!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两个密码不相同!');
              },
            }),
          ]}
        >
          <Input.Password placeholder={'请再次输入密码'} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout} className={styles.btn}>
          <Button loading={loading} type="primary" htmlType="submit">
            确认修改  
          </Button>
        </Form.Item>
      </Form>
    </LoginBlock>
  )
}

export default connect()(ResetPassword);

