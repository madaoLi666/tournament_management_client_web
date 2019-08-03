import React, { useState, useEffect } from 'react';
import {
  Form, Input, Cascader, Row, Col
} from 'antd';
import { FormProps ,ValidationRule } from 'antd/lib/form';
import { ColProps, RowProps } from 'antd/lib/grid';

import { checkPhoneNumber,  checkEmail } from '@/utils/regulars.ts';
// @ts-ignore
import styles from './index.less';

// 自适应的姗格配置
const autoAdjust:ColProps = {
  xs: { span: 20 },
  sm: { span: 18 },
  md: { span: 16 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 8 },
};



const BUFormStyle:FormProps = {
  layout: 'vertical',
  labelCol: { xs: { span: 24 }, sm: { span: 4 }, md: { span: 4 }, lg: { span: 4 }, xl: { span: 4 }, xxl: { span: 4 }, },
  wrapperCol: { xs: { span: 24 }, sm: { span: 20 }, md: { span: 20 }, lg: { span: 20 }, xl: { span: 20 }, xxl: { span: 20 }, },
  colon: true,
  labelAlign: 'left'
};

class BindUnitForm extends React.Component<any, any>{

  componentDidMount(): void {
    // fetch('../src/public/residence.json')
    //   .then(response => (response.json()))
    //   .then(data => {console.log(data);})
    //   .catch(e => {console.error(e)});
  }

  // ------------  类型暂时找不到 -------------------------//
  // 与confirmPassword比较
  compareToConfirmPassword = (rule:any, value:any, callback:any) => {
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
  compareToFirstPassword = (rule:any, value:any, callback:any) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不相同');
    } else {
      callback();
    }
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    // @ts-ignore
    return (
      <div>
        <Form
          {...BUFormStyle}
          colon={true}
        >

          <Form.Item label='单位名称' >
            {getFieldDecorator('unitName', {
              rules: [{ required: true, message: '请输入单位名称'}],
              validateTrigger: 'onBlur'
            })(
              <Input placeholder='请输入单位名称'/>
            )}
          </Form.Item>

          <Form.Item label='密码' >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码'}, {validator: this.compareToConfirmPassword}],
            })(
              <Input type='password' placeholder='请输入密码' />
            )}
          </Form.Item>

          <Form.Item label='确认密码' >
            {getFieldDecorator('confirmPassword', {
              rules: [{ required: true, message: '请输入密码'},{validator: this.compareToFirstPassword}],

            })(
              <Input type='password' placeholder='请再次输入密码' />
            )}
          </Form.Item>

          <Form.Item label='联系人' >
            {getFieldDecorator('contact', {
              rules: [{ required: true, message: '请输入联系人姓名'}],
            })(
              <Input placeholder='请输入联系人姓名'/>
            )}
          </Form.Item>

          <Form.Item label='手机号码' >
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入手机号码'},{ pattern: checkPhoneNumber, message:'请输入正确的手机号码'}],
              validateTrigger: 'onBlur'
            })(
              <Input placeholder='请输入手机号码'/>
            )}
          </Form.Item>

          <Form.Item label='邮箱' >
            {getFieldDecorator('email', {
              rules: [{ required: true, message: '请输入电子邮箱'},{pattern: checkEmail, message:'请输入正确的邮箱地址'}],
              validateTrigger: 'onBlur'
            })(
              <Input placeholder='请输入邮箱地址' />
            )}
          </Form.Item>

          <Form.Item label='地址' >
            {getFieldDecorator('residence', {})(<p>留空</p>)}
          </Form.Item>
        </Form>
      </div>

    )
  }
}

const BUForm = Form.create()(BindUnitForm);


export default function BindUnit() {
  return (
    <div className={styles['bind-page']}>
      <Row type="flex" justify="center">
        <Col {...autoAdjust}>
          <BUForm/>
        </Col>
      </Row>
    </div>
  )
};

