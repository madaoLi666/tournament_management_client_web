import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Tabs, Cascader, Modal } from 'antd';
import AddressInput from '@/components/AddressInput/AddressInput.tsx';
import { FormComponentProps, FormProps, ValidateCallback } from 'antd/lib/form';
import { ColProps } from 'antd/lib/grid';
import { Dispatch } from 'redux';
import { checkEmail, checkPhoneNumber } from '@/utils/regulars.ts';
import { getQRCodeForUnitRegister } from '@/services/pay';

// @ts-ignore
import styles from './index.less';

interface NewUnitFromProps extends FormComponentProps {
  emitData: (data: any) => void;
  unitNameIsLegal: (unitName: string) => Promise<boolean>;
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
  // 检查单位名称是否和恶法
  checkUnitNameIsLegal = (rule: any, value: any, callback: Function) => {
    const { unitNameIsLegal } = this.props;
    // 没有检查value是否为空 不知道会不会bug
    unitNameIsLegal(value).then(res => {
      if (res) {callback();
      } else {
        callback('已有相同的单位名称');
      }
    });
  };
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
          <Form.Item label='单位名称'>
            {getFieldDecorator('unitName', {
              rules: [{ required: true, message: '请输入单位名称' },{ validator: this.checkUnitNameIsLegal }],
              validateTrigger: 'onBlur',
            })(
              <Input placeholder='请输入单位名称' autoComplete='off' />,
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
            {getFieldDecorator('residence', {})(
              <AddressInput/>,
            )}
          </Form.Item>
          <Form.Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const NUForm = Form.create<NewUnitFromProps>()(NewUnitForm);

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

  render(): React.ReactNode {

    const { getFieldDecorator } = this.props.form;


    return (
      <Form
        {...newUnitFormStyle}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label='用户名'>
          {getFieldDecorator('unitName',{
            rules:[{required:true, message: '请输入用户名称'}],
          })(
            <Input placeholder='请输入用户名称' autoComplete='off' />,
          )}
        </Form.Item>

        <Form.Item label='密码'>
          {getFieldDecorator('password',{
            rules:[{required:true, message: '请输入用户名称'}],
          })(
            <Input placeholder='请输入账号密码' type='password' autoComplete='off' />,
          )}
        </Form.Item>

        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const BForm = Form.create<BindUnitFromProps>()(BindUnitForm);



function BindUnit(props: { dispatch: Dispatch; phoneNumber: string}) {

  // modal的visible
  const [visible,setVisible] = useState(false);
  // 图片
  const [picUrl,setPicUrl] = useState('');

  // 传入 NewUnitForm 中，已提供外部的表单处理
  // 这里可以拿到表单的信息
  function submitRegister(data: any): void {
    const { dispatch, phoneNumber} = props;
    // 返回为图片
    getQRCodeForUnitRegister({phonenumber: phoneNumber})
      .then(async (res) => {
        await setPicUrl(res.data);
        await openDialog();
      });

    // 打开modal展示图片同时进行轮询
    dispatch({
      type: 'register/checkoutUnitRegisterPayStatus'
    })
  }

  function openDialog() {
    // 打开dialog
    setVisible(true);
    // 开始轮询
  }


  // 提供给教练员/领队做单位的绑定
  function submitBindUnitData(data: any): void{
    console.log(data);
  }
  // 这里做异步请求检查单位的名称是否存在
  async function checkUnitNameIsLegal(unitName:string): Promise<boolean> {
    return await fetch(`http://47.106.15.217:9090/mock/19/newUnitAccount/?name=${unitName}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'GET',
    })
      .then(response => {
        return response.ok;
      });
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
      <Modal visible={visible} style={{textAlign: 'center'}} footer={null}>
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

export default connect(({user}:any) => ({
  phoneNumber: user.phoneNumber
}))(BindUnit);
