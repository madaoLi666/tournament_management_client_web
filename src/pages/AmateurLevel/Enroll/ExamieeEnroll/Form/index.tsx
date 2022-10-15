import React from 'react';
import { FormProps } from 'antd/lib/form';
import { Form, Input } from 'antd';
import { checkEmail, checkPhoneNumber } from '@/utils/regulars';
import AddressInput from '@/components/AddressInput/addressInput';
import UploadForm from '@/components/UploadForm/uploadForm';
import IdForm from '@/components/athleteForm/components/idForm';

// 表单样式
const formStyle: FormProps = {
  layout: 'horizontal',
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
  colon: true,
  labelAlign: 'right',
};

const { Item } = Form;

interface AthleteFormProps {
  isAdd: boolean; // 是否新增运动员
  initialValue: any; // 表单初始值
  formRef: any; // 表单实例，即 const form = useForm();

  haveContact?: boolean; // 有紧急联系人,个人中心有这个选项
}

// 运动员信息表单
function AthleteForm(props: AthleteFormProps) {
  const { isAdd, initialValue, formRef, haveContact } = props;


  return (
    <Form {...formStyle} ref={formRef} scrollToFirstError>
      <Item label="姓名" name={'name'} rules={[{ required: true, message: '请输入运动员姓名' }]}>
        <Input placeholder="请输入真实姓名" />
      </Item>
      <IdForm isAdd={isAdd} formRef={formRef} />
      <Item
        label="联系电话"
        name={'phone'}
        rules={[{ pattern: checkPhoneNumber, message: '请输入正确的手机号码' }]}
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
      <AddressInput />
      <Item
        style={haveContact ? {} : { display: 'none' }}
        label="紧急联系人"
        name="emergencyContact"
      >
        <Input placeholder="选填" />
      </Item>
      <Item
        style={haveContact ? {} : { display: 'none' }}
        label="紧急联系人电话"
        name="emergencyContactPhone"
        rules={[{ pattern: checkPhoneNumber, message: '请输入正确的手机号码' }]}
      >
        <Input placeholder="选填" />
      </Item>
      <UploadForm
        guaranteePic={
          initialValue ? (haveContact ? initialValue.face : initialValue.athlete.face) : null
        }
        name={'uploadPic'}
        label={'运动员照片（选填）'}
        required={false}
      />
    </Form>
  );
}

export default AthleteForm;
