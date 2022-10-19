import React, { useState } from 'react';
import { Form, Input, Row, Col, Checkbox, Button, message } from 'antd';
import { checkEmail, checkPhoneNumber } from '@/utils/regulars';
import styles from './index.less';
import { router } from 'umi';
import { Dispatch, connect } from 'dva';
import { personalAccountRegister } from '@/services/registerServices';

// 个人用户注册信息接口
export interface PersonInfo {
  username: string;
  password: string;
  email: string;
  emailcode: string;
  phonenumber: string;
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

interface RegisterFormProps {
  dispatch: Dispatch;
}

function RegisterForm(props: RegisterFormProps) {
  const [form] = Form.useForm();
  const { dispatch } = props;
  const [loading, setLoading] = useState(false);

  const [timeInterval, setTimeInterval] = useState(0);

  const onFinish = (values: any) => {
    if (values.agreement === undefined || values.agreement === false) {
      message.warning('请先勾选已阅读并同意隐私政策');
      return;
    }
    setLoading(true);
    const personInfo: PersonInfo = {
      username: values.userID,
      password: values.password,
      email: values.email,
      emailcode: values.emailVerificationCode,
      phonenumber: values.phone_number,
    };
    let res = personalAccountRegister(personInfo);
    res.then(resp => {
      if (resp) {
        dispatch({
          type: 'user/saveInfo',
          payload: resp,
        });
        message.success('注册成功');
        router.push('/login');
      }
      setLoading(false);
    });
    res.catch(resp => {
      message.error('[register]error: ' + JSON.stringify(resp));
      console.error('[register]error: ' + JSON.stringify(resp));
      setLoading(false);
    });
  };

  const onFinishFailed = ({ errorFields }: any) => {
    // 滚动到错误位置
    form.scrollToField(errorFields[0].name);
  };

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

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      className={styles.form}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="phone_number"
        label="手机号码"
        rules={[
          { required: true, message: '请输入您的手机号码!' },
          { pattern: checkPhoneNumber, message: '请输入格式正确的手机号码！' },
        ]}
      >
        <Input placeholder="请输入您的手机号码" />
      </Form.Item>

      <Form.Item
        name="userID"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入您的用户名!',
            whitespace: true,
          },
        ]}
      >
        <Input placeholder={'请输入您要使用的用户名'} />
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

      {/* <Form.Item label="邮箱验证码" className={styles.emailCode}>
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
      </Form.Item> */}

      <Form.Item
        name="agreement"
        valuePropName="checked"
        {...tailFormItemLayout}
      >
        <Checkbox>
          我已阅读并同意
          <a
            target="_blank"
            href="https://www.gsta.top/nstatic/react/privacy.html"
          >
            &nbsp;隐私政策
          </a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout} className={styles.btn}>
        <Button loading={loading} type="primary" htmlType="submit">
          注册
        </Button>
        <span className={styles.span}>
          <a onClick={() => router.push('/login')}>使用已有账号登录</a>
        </span>
      </Form.Item>
    </Form>
  );
}

export default connect()(RegisterForm);
