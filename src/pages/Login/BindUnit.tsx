import React, { useState, forwardRef } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Tabs, Modal, message, Icon, Statistic } from 'antd';
import AddressInput from '@/components/AddressInput/AddressInput.tsx';
import { FormComponentProps, FormProps, ValidateCallback } from 'antd/lib/form';
import { ColProps } from 'antd/lib/grid';
import { Dispatch } from 'redux';
import { checkEmail, checkPhoneNumber } from '@/utils/regulars.ts';
import { getQRCodeForUnitRegister, checkUnitIsPay, } from '@/services/pay';
import { newUnitAccount } from '@/services/register';

const { Countdown } = Statistic;

// @ts-ignore
import styles from './index.less';

interface NewUnitFromProps extends FormComponentProps {
  emitData: (data: any) => void;
  unitNameIsLegal: (unitName: string) => Promise<{data:string,error:string,notice:string}>;
}
interface BindUnitFromProps extends FormComponentProps {
  emitData: (data: any) => void;
}

const { TabPane } = Tabs;
// 自适应的姗格配置
const autoAdjust: ColProps = {
  xs: { span: 20 },
  sm: { span: 18 },
  md: { span: 16 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 8 },
};
// 注册新单位表单
const newUnitFormStyle: FormProps = {
  layout: 'horizontal',
  labelCol: { xs: { span: 24 }, sm: { span: 4 }, md: { span: 4 }, lg: { span: 4 }, xl: { span: 4 }, xxl: { span: 4 } },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 20 },
    xl: { span: 20 },
    xxl: { span: 20 },
  },
  colon: true,
  labelAlign: 'right',
};

class NewUnitForm extends React.Component<NewUnitFromProps, any> {

  constructor(props: NewUnitFromProps) {
    super(props);
    this.state = {
      validStatus: ''
    }
  }

  componentDidMount(): void {}

  // ------------  类型暂时找不到 -------------------------//
  // 与confirmPassword比较
  compareToConfirmPassword = (rule: any, value: any, callback: Function) => {
    const { form } = this.props;
    const confirmPassword = form.getFieldValue('confirmPassword');
    if (value && confirmPassword && value !== confirmPassword) {
      // 去验证 confirmPassword
      form.validateFields(['confirmPassword'], { force: true });
    } else {
      callback();
    }
  };
  // 与password比较
  compareToFirstPassword = (rule: any, value: any, callback: Function) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不相同');
    } else {
      callback();
    }
  };
  // 检查单位名称是否和合法
  checkUnitNameIsLegal = (rule: any, value: any, callback: Function) => {
    const setSuccess = () => {
      this.setState({
        validStatus: 'success'
      })
    }
    const setError = () => {
      this.setState({
        validStatus: 'error'
      })
    }
    if (value === "" || value === null || value === undefined) {
      callback();
      this.setState({
        validStatus: 'error'
      })
      return;
    }
    const { unitNameIsLegal } = this.props;
    // 没有检查value是否为空 不知道会不会bug
    let res = unitNameIsLegal(value);
    res.then(function (result:{data:string,error:string,notice:string}) {
      if (result.data !== "true") {
        callback();
        setSuccess();
        return;
      } else {
        callback('已有相同的单位名称');
        setError();
        return;
      }
    });
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setSuccess = () => {
      this.setState({
        validStatus: 'success'
      })
    }
    const setError = () => {
      this.setState({
        validStatus: 'error'
      })
    }
    const { unitNameIsLegal } = this.props;

    if (e.currentTarget.value === "" || e.currentTarget.value === null || e.currentTarget.value === undefined) {
      setError();
      return;
    }

    let res = unitNameIsLegal(e.currentTarget.value);
    res.then(function (result:{data:string,error:string,notice:string}) {
      if (result.data !== "true") {
        setSuccess();
        return;
      } else {
        setError();
        return;
      }
    });
  }

  // 提交信息
  handleSubmit = (e: React.FormEvent): void => {
    const { emitData } = this.props;
    // 阻止冒泡
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: ValidateCallback<any>, values: any) => {
      if (!err) {
        emitData(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form
          {...newUnitFormStyle}
          onSubmit={this.handleSubmit}
        >
          <Form.Item label='单位名称' hasFeedback={true} validateStatus={this.state.validStatus} >
            {getFieldDecorator('unitName', {
              rules: [{ required: true, message: '请输入单位名称' },{ validator: this.checkUnitNameIsLegal }],
              validateTrigger: 'onBlur',
            })(
              <Input onChange={this.handleChange} placeholder='请输入单位名称' autoComplete='off' />,
            )}
          </Form.Item>
          <Form.Item label='密码'>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }, { validator: this.compareToConfirmPassword }],
            })(
              <Input type='password' placeholder='请输入密码' autoComplete='off'/>,
            )}
          </Form.Item>
          <Form.Item label='确认密码'>
            {getFieldDecorator('confirmPassword', {
              rules: [{ required: true, message: '请输入密码' }, { validator: this.compareToFirstPassword }],

            })(
              <Input type='password' placeholder='请再次输入密码' autoComplete='off' />,
            )}
          </Form.Item>
          <Form.Item label='联系人'>
            {getFieldDecorator('contact', {
              rules: [{ required: true, message: '请输入联系人姓名' }],
            })(
              <Input placeholder='请输入联系人姓名' autoComplete='off' />,
            )}
          </Form.Item>
          <Form.Item label='手机号码'>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入手机号码' }, { pattern: checkPhoneNumber, message: '请输入正确的手机号码' }],
              validateTrigger: 'onBlur',
            })(
              <Input placeholder='请输入手机号码' autoComplete='off' />,
            )}
          </Form.Item>
          <Form.Item label='邮箱'>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: '请输入电子邮箱' }, { pattern: checkEmail, message: '请输入正确的邮箱地址' }],
              validateTrigger: 'onBlur',
            })(
              <Input placeholder='请输入邮箱地址' autoComplete='off' />,
            )}
          </Form.Item>
          <Form.Item label='地址'>
            {getFieldDecorator('residence', {
              rules:[{required:true, message:'请输入你的地址信息'}]
            })(
              <AddressInput/>,
            )}
          </Form.Item>
          <Form.Item label='邮政编码'>
            {getFieldDecorator('postalCode',{
              rules:[{required:true, message:'请输入邮政编码'}]
            })(
              <Input placeholder='请输入邮政编码'/>
            )}
          </Form.Item>
          <Form.Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const NUForm = Form.create<NewUnitFromProps>()(NewUnitForm);

// 输入框Group类
class CodeInput extends React.Component<any,any> {

  constructor(props:any) {
    super(props);

    const value = props.value || {};

    this.state = {
      code:value.code
    }
  }

  public triggerChange = (code: string) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({code});
    }
  }

  public handleCodeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    this.triggerChange(e.target.value);
  }

  render() {

    return (
      <Input.Group compact={true} style={{width:"100%"}}>
        <Input placeholder="请输入验证码" onChange={this.handleCodeChange} style={{width:"60%",textAlign:"left"}} />
        <Button onClick={this.props.sendCode} style={{width:"40%"}} type="primary" >发送验证码</Button>
      </Input.Group>
    )
  }
}

// 绑定单位表单
class BindUnitForm extends React.Component<NewUnitFromProps, any>{

  // 提交信息
  handleSubmit = (e: React.FormEvent): void => {
    const { emitData } = this.props;
    // 阻止冒泡
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: ValidateCallback<any>, values: any) => {
      if (!err) {
        emitData(values);
      }
    });
  };

  checkPrice = (rule: any, value: {code:string}, callback: any) => {
    if(value.code === undefined || value.code === null || value.code === "") {
      callback('请输入验证码！');
      return;
    }
    callback();
    return;
  };

  public sendCode = (event:React.MouseEvent<HTMLElement>) => {
    // @ts-ignore
    this.props.dispatch({
      type:'register/bindUnitAccountAndSendCode',
      payload: {
        unitname:"",
        password:"",
        code:""
      }
    })
  }

  render(): React.ReactNode {

    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        {...newUnitFormStyle}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label='用户名'>
          {getFieldDecorator('unitName',{
            rules:[{required:true, message: '请输入单位名称'}],
          })(
            <Input placeholder='请输入单位名称' autoComplete='off' />,
          )}
        </Form.Item>

        <Form.Item label='密码'>
          {getFieldDecorator('password',{
            rules:[{required:true, message: '请输入单位密码'}],
          })(
            <Input placeholder='请输入单位密码' type='password' autoComplete='off' />,
          )}
        </Form.Item>

        <Form.Item label="验证码" extra="ps:发送的手机号为该单位注册时登记的">
          {getFieldDecorator('code',{
            initialValue: {code:null},
            rules: [{validator: this.checkPrice}]
          })(<CodeInput sendCode={this.sendCode} />)}
        </Form.Item>

        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            绑定
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const BForm = connect()(Form.create<BindUnitFromProps>()(BindUnitForm));

function BindUnit(props: { dispatch: Dispatch; userId: number}) {

  // modal的visible
  const [visible,setVisible] = useState(false);
  // 图片
  const [picUrl,setPicUrl] = useState('');

  // 传入 NewUnitForm 中，已提供外部的表单处理
  // 这里可以拿到表单的信息
  async function submitRegister(data: any): Promise<any> {
    const { dispatch , userId} = props;
    // 发起请求检查是否支付了费用
    let isPay = await checkoutIsPay().then(res => (res));
    console.log(isPay);
    if(!isPay) {
      // 获取支付二维码
      let pic = await getPayQRCodeUrl().then(res => (res));
      //
      if(pic) {
        setPicUrl(pic);
        openDialog();
      }else{
        message.error('获取支付二维码失败')
      }
    }else{
      dispatch({type: 'register/registerUnitAccount', payload: {unitData: {userId: userId,...data}} });
    }
  }

  // 判断是否已经支付费用
  async function checkoutIsPay(): Promise<any> {
    const { dispatch,userId } = props;
    let res = await checkUnitIsPay({user:userId});
    if(res.data === '' || res.data === undefined){
      return false;
    }else{
      await dispatch({type: 'register/modifyUnitRegisterPayCode', payload: {payCode: res.data}});
      return true;
    }
  }
  // 获取支付二维码图片
  async function getPayQRCodeUrl(): Promise<any> {
    const { userId } = props;
    let res = await getQRCodeForUnitRegister({user:userId}).then( res => (res));
    console.log(res);
    if(res.data !== '' && res.error === ''){
      return res.data;
    }else{
      return false;
    }
  }

  // 打开dialog
  function openDialog() {
    // 打开modal展示图片同时进行轮询
    setVisible(true);
    let i = setInterval(() => {
      checkoutIsPay().then(res => {
        if(res) {
          // 如果支付了
          closeDialog();
          clearInterval(i);
          message.success('已成功支付单位注册费用，请再次点击注册');
        }
      });
    },2000);
  }
  // 关闭dialog
  function closeDialog() {
    setVisible(false);
  }

  // 提供给教练员/领队做单位的绑定
  function submitBindUnitData(data: any): void {
    let myPayload = {
      unitname:"",
      password:"",
      code:""
    };
    myPayload.code = data.code.code;
    myPayload.password = data.password;
    myPayload.unitname = data.unitName;
    props.dispatch({
      type: 'register/bindUnitAccountAndSendCode',
      payload: myPayload
    })
  }
  // 这里做异步请求检查单位的名称是否存在
  async function checkUnitNameIsLegal(unitName:string): Promise<{data:string,error:string,notice:string}> {
    return await newUnitAccount({name:unitName})
    // return await fetch(`http://47.106.15.217:9090/mock/19/newUnitAccount/?name=${unitName}`, {
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   method: 'GET',
    // })
    //   .then(response => {
    //     return response.ok;
    //   });
  }

  const TabsDOM: React.ReactNode = (
    <Tabs>
      <TabPane tab={<div>注册单位账号</div>} key="1">
        <NUForm
          emitData={submitRegister}
          unitNameIsLegal={checkUnitNameIsLegal}
        />
      </TabPane>
      <TabPane tab={<div>已有账号，马上绑定</div>} key="2">
        <BForm emitData={submitBindUnitData}/>
      </TabPane>
    </Tabs>
  );

  return (
    <div className={styles['bind-page']}>
      <Row type="flex" justify="center">
        <Col {...autoAdjust}>
          <Card
            style={{ width: '100%', height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111' }}
            headStyle={{ color: '#2a8ff7' }}
          >
            {TabsDOM}
          </Card>
        </Col>
      </Row>
      <Modal
        visible={visible}
        style={{textAlign: 'center'}}
        footer={null}
        onCancel={closeDialog}
      >
        <div>
          <img src={picUrl} alt=""/>
        </div>
        <div style={{marginTop: '20px'}}>
          <h4>--&nbsp;&nbsp;请扫码支付相关注册费用&nbsp;&nbsp;--</h4>
        </div>
      </Modal>
    </div>
  );
}

export default connect(({register,login}:any) => ({
  payCode: register.unitRegisterPayCode,
  userId: login.userId
}))(BindUnit);
