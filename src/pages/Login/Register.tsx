import React, { useState, useEffect } from 'react';
// @ts-ignore
import styles from './index.less';
import { Row, Col, Card, Tabs, Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

// 注册新用户表单项
interface UserFormProps {
  form?: FormComponentProps;
  teststr?: string;
}

// 标签页
const { TabPane } = Tabs;

// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
};
// 表单layout
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

// 已有账号登陆表单layout
const oldFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
};
// 标签页tab文字DOM
let TabsTitle1: React.ReactNode = (<strong>第一次登陆，注册新账号</strong>);
let TabsTitle2: React.ReactNode = (<strong>已有账号，马上绑定</strong>);

class UserForm extends React.Component<UserFormProps & FormComponentProps, any> {
  constructor(props: UserFormProps & FormComponentProps) {
    super(props);
    this.state = {
      // 登陆密码二次验证
      confirmDirty: false,
    };
  }

  // 提交表单
  public handleSubmit = (event: any) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form :', values);
      }
    });
  };


  // 验证密码onBlur 类型暂时不知道，暂定any
  public handleConfirm = (e: any) => {
    const { value } = e.target;
    let { confirmDirty } = this.state;
    this.setState({
      confirmDirty: confirmDirty || !!value,
    });
  };


  // 验证二次密码 类型暂时不知道，暂定any
  public compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    // getFieldValue可以通过key获取表单的值
    if (value && value !== form.getFieldValue('password')) {
      callback('两个密码不相同！请检查');
    } else {
      callback();
    }
  };

  // 也是验证密码
  public validateToNextPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };


  render() {
    // Row的gutter
    //
    const { getFieldDecorator } = this.props.form;
    // 最后提交按钮的layout
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='用户名'>
          {getFieldDecorator('userID', {
            rules: [{ required: true, message: '请输入用户名！' }],
          })(<Input placeholder='如果是用微信授权登陆,可预填微信名称'/>)}
        </Form.Item>
        <Form.Item label='登陆密码' hasFeedback={true}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码！' }, { validator: this.validateToNextPassword }],
          })(<Input.Password/>)}
        </Form.Item>
        <Form.Item label='确认密码' hasFeedback={true}>
          {getFieldDecorator('comfirmPassword', {
            rules: [{ required: true, message: '请确认密码！' }, { validator: this.compareToFirstPassword }],
          })(<Input.Password onBlur={this.handleConfirm}/>)}
        </Form.Item>
        <Form.Item label='验证码' extra='请输入右边的验证码'>
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('verificationCode', {
                rules: [{ required: true, message: '请输入右边的验证码！' }],
              })(<Input/>)}
            </Col>
            <Col span={12}>
              <Button type="primary">获取验证码</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label='邮箱'>
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: '请输入邮箱！' }, { type: 'email', message: '请输入正确的邮箱格式！' }],
              })(<Input/>)}
            </Col>
            <Col span={12}>
              <Button type="primary">发送邮箱验证码</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label='邮箱验证码'>
          {getFieldDecorator('emailVerificationCode', {
            rules: [{ required: true, message: '请输入邮箱验证码！' }],
          })(<Input/>)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">注册绑定,并进入下一步操作</Button>
        </Form.Item>
      </Form>
    );
  }
}

const App = Form.create<UserFormProps & FormComponentProps>({
  name: 'register',
})(UserForm);


class Register extends React.Component<any, any> {
  // 标签页state,默认第一页
  constructor(props: any) {
    super(props);
    this.state = {
      TabsState: '1',
    };
  }


  render() {

    let test: UserFormProps = {
      teststr: '123',
    };

    let { TabsState } = this.state;

    // 标签页DOM
    let TabsDOM: React.ReactNode = (
      <Tabs defaultActiveKey={TabsState}>
        <TabPane tab={TabsTitle1} key="1">
          <App {...test} />
        </TabPane>
        <TabPane tab={TabsTitle2} key="2">
          Content2
          <p>可用单位账号密码登陆,进行取消单位授权操作</p>
        </TabPane>
      </Tabs>
    );

    return (
      <div className={styles['register-page']}>
        <Row justify="center" type="flex">
          <Col {...autoAdjust}>
            <div className={styles['register-block']}>
              <Card
                style={{ width: '100%', height: '150%', borderRadius: '5px', boxShadow: '1px 1px 5px #111' }}
                headStyle={{ color: '#2a8ff7' }}
              >
                {TabsDOM}
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }


}

export default Register;
