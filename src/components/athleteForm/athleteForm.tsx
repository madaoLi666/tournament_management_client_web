import React from 'react';
import { FormProps } from 'antd/lib/form';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import styles from './index.less';
import { checkEmail } from '@/utils/regulars';

// 样式
const formStyle: FormProps = {
  layout: 'horizontal',
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  colon: true,
  labelAlign: 'right',
};

const { Item } = Form;

interface AthleteFormProps {}

function AthleteForm(props: AthleteFormProps) {
  const isIDCard = true;
  //  ToDO support scrollToFirstError to simplify submit scroll logic.
  const onFinish = (values: any) => {};

  return (
    <Form {...formStyle} onFinish={onFinish}>
      <Item
        label="姓名"
        name={'name'}
        rules={[{ required: true, message: '请输入运动员姓名' }]}
      >
        <Input placeholder="请输入真实姓名" />
      </Item>
      {/*<Item label='证件类型' name={'idCardType'} >*/}
      {/*  {getFieldDecorator('idCardType',{*/}
      {/*    initialValue:'身份证',*/}
      {/*    rules: [{required:true,message:'请选择你的证件号码类型'}],*/}
      {/*  })(*/}
      {/*    <Select placeholder='请选择证件类型' disabled={this.state.input_disabled} onChange={this.handlerCertificationTypeChange}>*/}
      {/*      <Option value='身份证'>身份证</Option>*/}
      {/*      <Option value='港澳通行证'>港澳台回乡证</Option>*/}
      {/*    </Select>*/}
      {/*  )}*/}
      {/*</Item>*/}
      {/*<Item label='证件号码'>*/}
      {/*  {getFieldDecorator('identifyNumber',{*/}
      {/*    rules:[{required:true, message: '请填写证件号码'},{validator: this.handleIDCardChange}],*/}
      {/*  })(*/}
      {/*    <Input disabled={this.state.input_disabled} placeholder='请填写证件号码' autoComplete='off'/>*/}
      {/*  )}*/}
      {/*</Item>*/}
      <Item
        rules={[{ required: true, message: '请选择运动员性别' }]}
        label="性别"
        name={'sex'}
      >
        <Select disabled={isIDCard}>
          <Select.Option value="男">男</Select.Option>
          <Select.Option value="女">女</Select.Option>
        </Select>
      </Item>
      <Item label="出生年月日" name={'birthday'} className={styles['require']}>
        <DatePicker style={{ width: '100%' }} disabled={isIDCard} />
      </Item>
      <Item
        label="联系电话"
        name={'phone'}
        rules={[{ pattern: checkEmail, message: '请输入正确的手机号码' }]}
      >
        <Input placeholder="选填" />
      </Item>
      <Item
        label="邮箱"
        name={'email'}
        rules={[{ pattern: checkEmail, message: '请输入正确的电子邮箱地址' }]}
      >
        <Input placeholder="选填" />
      </Item>
      <Item label="地址" name={'residence'}>
        <Input />
      </Item>
      <Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          提交信息
        </Button>
      </Item>
    </Form>
  );
}

export default AthleteForm;
