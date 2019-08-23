import React from 'react';
import router from 'umi/router';
// @ts-ignore
import styles from './index.less';
import { Row, Col, Card, Tabs, Form, Input, Button, Modal, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { personalAccountRegister,PersonInfo } from '@/services/register.ts';
import { checkEmail, checkPhoneNumber } from '@/utils/regulars';



// 个人注册成功后返回信息
interface RightResponse {
  username?: string
  email?: string
  phone?: string
  unitaccount?: string
}

// 注册新用户表单项的接口
interface UserFormProps {
  sendCode?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  sendEmailCode?: (email: string) => void;
  form?: FormComponentProps;
}

// 已有账户表单项的接口，暂时不知道要写什么
interface OldUserFormProps {
  form?: FormComponentProps;
  sendCode?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// 标签页
const { TabPane } = Tabs;

// Col 自适应
const autoAdjust = {
  xs: { span: 16 },
   sm: { span: 12,offset:3 },
    md: { span: 12, offset:4 }, 
    lg: { span: 8, offset:6 }, 
    xl: { span: 8, offset:6 },
};
// 表单layout
const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 6 },
    md: { span: 5 },
    lg: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 15 },
    md: { span: 16 },
    lg: { span: 14 },
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
      span: 16,
      offset: 4,
    },
    md: { span: 20,offset: 3 },
    lg: { span: 20,offset: 3 },
  },
};
// 标签页tab文字DOM
let TabsTitle1: React.ReactNode = (<strong>第一次登陆，注册新账号</strong>);
let TabsTitle2: React.ReactNode = (<strong>已有账号，马上绑定</strong>);

// 用户注册表单
class UserForm extends React.Component<UserFormProps & FormComponentProps, any> {
  constructor(props: UserFormProps & FormComponentProps) {
    super(props);
    this.state = {
      // 登陆密码二次验证
      confirmDirty: false,
      email:'',
      // 注册失败对话框 state
      errorText:'error of register',
      visible: false,
      confirmLoading: false,
      timeInterval:0
    };
  }

  // 注册失败的对话框函数
  public showModal = () => {
    this.setState({
      visible: true
    })
  }
  // 对话框确定按钮
  public handleOK = () => {
    this.setState({
      errorText:this.state.errorText,
      confirmLoading: true
    })
    this.setState({
      visible: false,
    })
  }
  public handleCancel = () => {
    this.setState({
      visible: false,
    })
  }
  // 验证密码onBlur 类型暂时不知道，暂定any
  public handleConfirm = (e: any) => {
    const { value } = e.target;
    let { confirmDirty } = this.state;
    this.setState({
      confirmDirty: confirmDirty || !!value,
    });
  };
  // 验证二次密码
  public compareToFirstPassword = (rule: any, value: string, callback: Function) => {
    const { form } = this.props;
    // getFieldValue可以通过key获取表单的值
    if (value && value !== form.getFieldValue('password')) {
      callback('两个密码不相同！请检查');
    } else {
      callback();
    }
  };
  // 也是验证密码
  public validateToNextPassword = (rule: any, value: string, callback: Function) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  // onChang 绑定email
  public BindEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email:event.currentTarget.value
    })
  }
  // 给上层组件传email，然后根据email调用接口
  public toParent = () => {
    if(!checkEmail.test(this.state.email)) {
      message.error('请输入正确的邮箱');
      return;
    }
    this.props.sendEmailCode(this.state.email);
    const myTimeInterval:number = 60000;
    this.setState({
      timeInterval:myTimeInterval
    });
    let counts = 0;
    // 计时 用于防止用户多次发送验证码
    let i = setInterval(() => {
      this.setState({timeInterval: this.state.timeInterval-1000});
      counts++;
      if(counts === 60) {
        clearInterval(i);
      }
    },1000);
  };
  // 提交表单
  public handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //@ts-ignore
    const { dispatch} = this.props;
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        let personInfo:PersonInfo = {
            username: values.userID,
            password: values.password,
            email: values.email,
            emailcode: values.emailVerificationCode,
            // @ts-ignore
            phonenumber: this.props.personInfo.phoneNumber
        };
        console.log(personInfo);
        // 如果注册成功存进user
        let saveState = (value: RightResponse) => {
          // @ts-ignore
          this.props.dispatch({
            type: 'user/saveInfo',
            payload: value
          })
        };
        // 调用修改state
        let changeState = (error: string) => {
          this.setState({
            visible: true,
            errorText: error
          })
        }
        let res = personalAccountRegister(personInfo);
        res.then((resp) => {
          if (resp) {
            if (resp.error !== "") {
              console.log(res);
              changeState(resp.error);
            }else {
              console.log(res);
              dispatch({type: 'login/modifyUserId', payload: {userId: resp.data.user}});
              saveState(resp.data);
              router.push('/login/infoSupplement')
            }
          }
        })
      }
    });
  };


  render() {

    const { getFieldDecorator } = this.props.form;
    const { visible,confirmLoading,errorText } = this.state;

    return (
      <div>
        <Modal
          title="注册错误"
          visible={visible}
          onOk={this.handleOK}
          onCancel={this.handleCancel}
          footer={<Button type="primary" onClick={this.handleOK} >确定</Button>}
        >
          <p>{errorText}</p>
        </Modal>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label='用户名'>
            {getFieldDecorator('userID', {
              rules: [{ required: true, message: '请输入用户名！' }],
            })(<Input placeholder='如果是用微信授权登陆,可预填微信名称'/>)}
          </Form.Item>
          <Form.Item label='登陆密码' hasFeedback={true}>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码！' },{min:10,message:'密码长度至少为10位'}, { validator: this.validateToNextPassword }],
            })(<Input.Password placeholder="密码长度最少为10位"/>)}
          </Form.Item>
          <Form.Item label='确认密码' hasFeedback={true}>
            {getFieldDecorator('comfirmPassword', {
              rules: [{ required: true, message: '请确认密码！' }, { validator: this.compareToFirstPassword }],
            })(<Input.Password onBlur={this.handleConfirm}/>)}
          </Form.Item>
          <Form.Item label='邮箱'>
            <Row>
              <Col span={12}>
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: '请输入邮箱！' }, { type: 'email', message: '请输入正确的邮箱格式！' }],
                })(<Input  onChange={this.BindEmail} />)}
              </Col>
              <Col span={4}>
              {this.state.timeInterval === 0 ?
              <Button onClick={this.toParent} style={{width:166,height:32}} type="primary" >发送验证码</Button>
              :<Button type="primary" style={{width:166,height:32}} disabled={true} >{this.state.timeInterval/1000}秒</Button>
              }
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label='邮箱验证码'>
            {getFieldDecorator('emailVerificationCode', {
              rules: [{ required: true, message: '请输入邮箱验证码！' }],
            })(<Input/>)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" style={{width:"80%"}} htmlType="submit">注册绑定,并进入下一步操作</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

function phoneStateToProps(state: any) {
  return {personInfo: state.user}
}

const RegisterForm = connect(phoneStateToProps)(Form.create<UserFormProps & FormComponentProps>({
  name: 'register',
})(UserForm));

class OldUserForm extends React.Component<OldUserFormProps & FormComponentProps, any> {
  constructor(props: UserFormProps & FormComponentProps) {
    super(props);
    this.state = {
      timeInterval:0,
      code:''
    };
  }

  public handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form :', values);
      }
    });
  };

  public toParent = () => {
    this.props.sendCode(this.state.code);
    const myTimeInterval:number = 60000;
    this.setState({
      timeInterval:myTimeInterval
    });
    let counts = 0;
    // 计时 用于防止用户多次发送验证码
    let i = setInterval(() => {
      this.setState({timeInterval: this.state.timeInterval-1000});
      counts++;
      if(counts === 60) {
        clearInterval(i);
      }
    },1000);
  }


  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='用户名'>
          {getFieldDecorator('oldUserID', {
            rules: [{ required: true, message: '请输入用户名！' }],
          })(<Input/>)}
        </Form.Item>
        <Form.Item label='密码'>
          {getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: '请输入密码！' },{min:10,message:'密码长度至少为10位'}],
          })(<Input.Password placeholder="密码长度最少为10位"/>)}
        </Form.Item>
        <Form.Item label='验证码'>
          <Row>
            <Col span={12}>
              {getFieldDecorator('oldVerificationCode', {
                rules: [{ required: true, message: '请输入验证码！' }],
              })(<Input/>)}
              </Col>
              <Col span={4}>
              {this.state.timeInterval === 0 ?
              <Button onClick={this.toParent} style={{width:166,height:32}} type="primary" >发送验证码</Button>
              :<Button type="primary" style={{width:166,height:32}} disabled={true} >{this.state.timeInterval/1000}秒</Button>
              }
              </Col>
          </Row>
        </Form.Item>
        <p style={{ marginTop: 40 }}>可用单位账号密码登陆,进行取消单位授权操作</p>
        <Form.Item {...tailFormItemLayout} style={{ marginTop: 40 }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>注册绑定,并进入下一步操作</Button>
        </Form.Item>
      </Form>
    );
  }
}

const OldUserFormInfo = connect()(Form.create<OldUserFormProps & FormComponentProps>({
  name: 'oldUser',
})(OldUserForm));

class Register extends React.Component<any, any> {
  // 标签页state,默认第一页
  constructor(props: any) {
    super(props);
    this.state = {
      TabsState: '1',
    };
  }

  // 获取验证码
  public sendCode = (event:React.MouseEvent<HTMLButtonElement>) => {
    const { dispatch } = this.props;
    // 调用接口
    dispatch({
      type:'register/sendVerificationCode'
    }
    )
  }
  // 获取邮箱验证码
  public sendEmail = (email: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'register/sendEmailCode',
      payload: email
    })
  }
  render() {

    let { TabsState } = this.state;

    // 标签页DOM
    let TabsDOM: React.ReactNode = (
      <Tabs defaultActiveKey={TabsState}>
        <TabPane tab={TabsTitle1} key="1">
          <RegisterForm sendCode={this.sendCode} sendEmailCode={this.sendEmail} />
        </TabPane>
        {/* <TabPane tab={TabsTitle2} key="2">
          <OldUserFormInfo sendCode={this.sendCode} />
        </TabPane> */}
      </Tabs>
    );

    return (
      <div className={styles['register-page']}>
        <Row type="flex">
          <Col {...autoAdjust}>
            <div className={styles['register-block']}>
              <Card
                style={{ width: '150%' ,height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111' }}
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

export default connect()(Register);
