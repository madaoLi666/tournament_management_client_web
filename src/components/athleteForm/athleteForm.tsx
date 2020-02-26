import React, { forwardRef, useState } from 'react';
import { FormProps } from 'antd/lib/form';
import { Button, Form, Input, Select } from 'antd';
import styles from './index.less';
import { checkEmail, checkIDCard, checkPhoneNumber } from '@/utils/regulars';
import AddressInput from '@/components/AddressInput/addressInput';
import { DatePicker } from '@/components/DayJs';
import moment from 'dayjs';
import UploadForm from '@/components/UploadForm/uploadForm';

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
  initialValue: any;
  formRef: any;
}

// 表单
function AthleteForm(props: AthleteFormProps) {
  const { isAdd, initialValue, formRef } = props;
  // 控制身份证类别
  const [isHongKong, setIsHongKong] = useState(false);

  const onFinish = (values: any) => {
    console.log(values);
  };

  // 证件类型change事件
  const handlerCertificationTypeChange = (value: string) => {
    if (value === '身份证') {
      setIsHongKong(false);
    } else {
      setIsHongKong(true);
    }
    formRef.current.resetFields(['identifyNumber', 'sex', 'birthday']);
  };

  const handleIDCardChange = (event: any) => {
    const idCard = event.target.value;
    // 证件类型为身份证
    if (isHongKong || idCard === undefined) {
      return;
    }
    // 未满18位
    if (idCard.length !== 18) {
      formRef.current.setFieldsValue({
        sex: null,
        birthday: null,
      });
      return;
    }
    if (checkIDCard.test(idCard) && !isHongKong) {
      const birthday = `${idCard.slice(6, 10)}${idCard.slice(10, 12)}${idCard.slice(12, 14)}`;
      formRef.current.setFieldsValue({
        sex: idCard.slice(-2, -1) % 2 === 1 ? '男' : '女',
        birthday: moment(birthday),
      });
      return;
    }
  };

  // 处理initialValue
  const mapStateToProps = (initialValue: any): any => {
    if (initialValue) {
      const { athlete } = initialValue;
      const residence = {
        city: athlete.province !== null ? athlete.province.split('-').slice(0, 3) : [],
        address: athlete.address !== null ? athlete.address : '',
      };
      return {
        name: athlete.name,
        idCardType: athlete.idcardtype,
        identifyNumber: athlete.idcard,
        sex: athlete.sex,
        birthday: moment(athlete.birthday),
        phone: athlete.phonenumber === null ? '' : athlete.phonenumber,
        email: athlete.email === null ? '' : athlete.email,
        residence: residence,
      };
    }
    return {};
  };

  return (
    <Form
      {...formStyle}
      ref={formRef}
      initialValues={mapStateToProps(initialValue)}
      scrollToFirstError
      onFinish={onFinish}
    >
      <Item label="姓名" name={'name'} rules={[{ required: true, message: '请输入运动员姓名' }]}>
        <Input placeholder="请输入真实姓名" />
      </Item>
      <Item
        label="证件类型"
        rules={[{ required: true, message: '请选择你的证件号码类型' }]}
        name={'idCardType'}
      >
        <Select
          placeholder="请选择证件类型"
          disabled={!isAdd}
          onChange={handlerCertificationTypeChange}
        >
          <Select.Option value="身份证">身份证</Select.Option>
          <Select.Option value="港澳通行证">港澳台回乡证</Select.Option>
        </Select>
      </Item>
      <Item
        label="证件号码"
        name={'identifyNumber'}
        rules={
          isHongKong
            ? [{ required: true, message: '请填写证件号码' }]
            : [
                { required: true, message: '请填写证件号码' },
                { pattern: checkIDCard, message: '请输入正确的身份证号' },
              ]
        }
      >
        <Input
          disabled={!isAdd}
          onChange={handleIDCardChange}
          placeholder="请填写证件号码"
          autoComplete="off"
        />
      </Item>
      <Item rules={[{ required: true, message: '请选择运动员性别' }]} label="性别" name={'sex'}>
        <Select placeholder={'请选择运动员性别'} disabled={!isHongKong}>
          <Select.Option value="男">男</Select.Option>
          <Select.Option value="女">女</Select.Option>
        </Select>
      </Item>
      <Item label="出生年月日" name={'birthday'} className={styles['require']}>
        <DatePicker
          placeholder={'请选择运动员出生日期'}
          style={{ width: '100%' }}
          disabled={!isHongKong}
        />
      </Item>
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
      <UploadForm
        guaranteePic={initialValue ? initialValue.athlete.face : null}
        name={'uploadPic'}
        label={'运动员照片（选填）'}
        required={false}
      />
    </Form>
  );
}

export default AthleteForm;