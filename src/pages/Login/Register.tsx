import React,{ useState,useEffect } from 'react';
// @ts-ignore
import styles from './index.less';
import { Row, Col, Card, Tabs, Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

// 注册新用户表单项的接口，暂时不知道要写什么
interface UserFormProps{
  form?:FormComponentProps;
}

// 已有账户表单项的接口，暂时不知道要写什么
interface OldUserFormProps{
  form?:FormComponentProps;
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
    xs: { span: 12 },
    sm: { span: 8 },
    md: { span: 6 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 15 },
    md: { span: 16 },
    lg: { span: 14 }
  },
};
// 最后提交按钮的layout
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 1,
    },
    md:{ span: 15,offset:4 },
    lg:{ span: 16,offset:4 }
  },
};

// 标签页tab文字DOM
let TabsTitle1:React.ReactNode = (
  <strong>第一次登陆，注册新账号</strong>
)
let TabsTitle2:React.ReactNode = (
  <strong>已有账号，马上绑定</strong>
)

class UserForm extends React.Component<UserFormProps & FormComponentProps,any> {
  constructor(props:UserFormProps & FormComponentProps) {
    super(props);
    this.state = { 
      // 登陆密码二次验证
      confirmDirty: false
     };
  }

  // 提交表单  
  public handleSubmit=(event:any) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err:any,values:any) => {
      if (!err) {
        console.log('Received values of form :',values);
      }
    })
  }

  // 验证密码onBlur 类型暂时不知道，暂定any
  public handleConfirm = (e:any) => {
    const { value } = e.target;
    let { confirmDirty } = this.state;
    this.setState({
      confirmDirty:confirmDirty || !!value
    })
  }

  // 验证二次密码
  public compareToFirstPassword = (rule:any, value:string, callback:Function) => {
    const { form } = this.props;
    // getFieldValue可以通过key获取表单的值
    if (value && value !== form.getFieldValue('password')) {
      callback('两个密码不相同！请检查')
    }else {
      callback();
    }
  }

  // 也是验证密码
  public validateToNextPassword = (rule:any, value:string, callback:Function) => {
    const { form } = this.props;
    if( value && this.state.confirmDirty ) {
      form.validateFields(['confirm'],{force: true});
    }
    callback();
  }


  render() {
  // Row的gutter
  // 
    const { getFieldDecorator } = this.props.form;

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='用户名'>
          {getFieldDecorator('userID',{
            rules:[{required: true, message: '请输入用户名！'}]
          })(<Input placeholder='如果是用微信授权登陆,可预填微信名称' />)}
        </Form.Item>
        <Form.Item label='登陆密码' hasFeedback={true}>
          {getFieldDecorator('password',{
            rules:[{required: true, message: '请输入密码！'},{validator:this.validateToNextPassword}]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label='确认密码' hasFeedback={true}>
          {getFieldDecorator('comfirmPassword',{
            rules:[{required: true,message: '请确认密码！'},{validator:this.compareToFirstPassword}]
          })(<Input.Password onBlur={this.handleConfirm} />)}
        </Form.Item>
        <Form.Item label='验证码'>
          <Row >
            <Col span={12}>
              {getFieldDecorator('verificationCode',{
                rules:[{required: true, message: '请输入右边的验证码！'}]
              })(<Input />)}
            </Col>
            <Col span={12}>
              <Button type="primary" >获取验证码</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label='邮箱'>
          <Row >
            <Col span={12}>
              {getFieldDecorator('email',{
                rules:[{required: true, message: '请输入邮箱！'},{type: 'email', message: '请输入正确的邮箱格式！'}]
              })(<Input />)}  
            </Col>
            <Col span={12}>
              <Button type="primary" >发送邮箱验证码</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label='邮箱验证码'>
          {getFieldDecorator('emailVerificationCode',{
            rules:[{required: true, message: '请输入邮箱验证码！'}]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" >注册绑定,并进入下一步操作</Button>
        </Form.Item>
      </Form>
    );
  }
}

const RegisterForm = Form.create<UserFormProps & FormComponentProps>({
  name:'register'
})(UserForm);


class OldUserForm extends React.Component<OldUserFormProps & FormComponentProps,any> {
  constructor(props:UserFormProps & FormComponentProps) {
    super(props);
    this.state = {  };
  }

  public handleSubmit = (e:any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err:any,values:any) => {
      if (!err) {
        console.log('Received values of form :',values);
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='用户名'>
          {getFieldDecorator('oldUserID',{
            rules:[{required: true, message: '请输入用户名！'}]
          })(<Input />)}
        </Form.Item>
        <Form.Item label='密码' >
          {getFieldDecorator('oldPassword',{
            rules:[{required: true, message: '请输入密码！'}]
          })(<Input />)}
        </Form.Item>
        <Form.Item label='验证码'>
          <Row >
            <Col span={12}>
              {getFieldDecorator('oldVerificationCode',{
                rules:[{required: true, message: '请输入右边的验证码！'}]
              })(<Input />)}
            </Col>
          </Row>
        </Form.Item>
        <p style={{marginTop:40}}>可用单位账号密码登陆,进行取消单位授权操作</p>
        <Form.Item {...tailFormItemLayout} style={{marginTop:40}}>
          <Button type="primary" htmlType="submit" style={{width:'100%'}} >注册绑定,并进入下一步操作</Button>
        </Form.Item>
      </Form>
    );
  }
}

const OldUserFormInfo = Form.create<OldUserFormProps & FormComponentProps>({
  name:'oldUser'
})(OldUserForm);



class Register extends React.Component<any,any> {
  // 标签页state,默认第一页
  constructor(props:any) {
    super(props);
    this.state = {
      TabsState:"1"
    }
  }


  render() {

  let { TabsState } = this.state;

  // 标签页DOM
  let TabsDOM:React.ReactNode = (
    <Tabs defaultActiveKey={TabsState} >
      <TabPane tab={TabsTitle1} key="1">
        <RegisterForm />
      </TabPane>
      <TabPane tab={TabsTitle2} key="2">
        <OldUserFormInfo />
      </TabPane>
    </Tabs>
  )

  return (
    <div className={styles['register-page']} >
      <Row justify="center" type="flex">
        <Col {...autoAdjust}>
          <div className={styles['register-block']}>
            <Card 
              style={{width: '100%',height: '150%', borderRadius: '5px', boxShadow: '1px 1px 5px #111'}}
              headStyle={{color: '#2a8ff7'}}
            >
              {TabsDOM}
            </Card>
          </div>
        </Col>
      </Row>   
    </div>
  )
  }



}

export default Register;
