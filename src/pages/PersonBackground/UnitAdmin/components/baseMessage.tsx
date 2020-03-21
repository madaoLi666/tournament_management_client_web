import React, { useState } from 'react';
import styles from '../index.less';
import { Button, Form, Input, message } from 'antd';
import { newUnitAccount } from '@/services/registerServices';
import { checkPhoneNumber } from '@/utils/regulars';
import AddressInput from '@/components/AddressInput/addressInput';
import { CurrentAccount } from '@/pages/PersonBackground/UnitAdmin/unitAdmin';
import { Dispatch, connect } from 'dva';

const { Item } = Form;

interface BaseMessageProps {
  currentAccountName: string;
  unitdata_id: number;
  dispatch: Dispatch;
  currentAccount: any;
}

function BaseMessage(props: BaseMessageProps) {
  const { currentAccountName, unitdata_id, dispatch, currentAccount } = props;
  const [form] = Form.useForm();
  const [validStatus, setValidStatus] = useState<
    '' | 'error' | 'success' | 'warning' | 'validating'
  >('success');

  const onFinish = (values: any) => {
    let temp: CurrentAccount = {
      unitdata_id: unitdata_id,
      email: values.email,
      contactperson: values.contactperson,
      contactphone: values.contactphone,
      postalcode: values.postalcode,
      name: values.name,
      province: values.residence.city.join('-'),
      address: values.residence.address,
    };
    dispatch({
      type: 'user/changeUnitBasicData',
      payload: temp,
    });
  };

  // 校验单位名称是否重复
  async function checkUnitName(
    unitName: string,
  ): Promise<{ data: string; error: string; notice: string }> {
    return await newUnitAccount({ name: unitName });
  }

  const mapInitialValue = (currentAccount: any): any => {
    if (currentAccount) {
      return {
        name: currentAccount.name,
        contactperson: currentAccount.contactperson,
        contactphone: currentAccount.contactphone,
        email: currentAccount.email,
        postalcode: currentAccount.postalcode,
        residence: {
          // city: currentAccount.province,
          address: currentAccount.address,
        },
      };
    }
    return {};
  };

  return (
    <Form
      layout="vertical"
      initialValues={mapInitialValue(currentAccount)}
      hideRequiredMark
      onFinish={onFinish}
    >
      <Item
        name="name"
        validateStatus={validStatus}
        validateFirst={true}
        validateTrigger="onBlur"
        rules={[
          { required: true, message: '请输入单位名称' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (value === currentAccountName) {
                setValidStatus('success');
                return Promise.resolve();
              }
              let res = checkUnitName(value);
              res.then(function(result: { data: string; error: string; notice: string }) {
                if (result) {
                  setValidStatus('success');
                  return Promise.resolve();
                } else {
                  setValidStatus('error');
                  return Promise.reject('已有相同的单位名称');
                }
              });
              return Promise.resolve();
            },
          }),
        ]}
        label="单位名称"
        extra="注：此项用于验证会员单位"
        hasFeedback
      >
        <Input />
      </Item>
      <Item
        label="单位联系人"
        name="contactperson"
        rules={[{ required: true, message: '请输入单位联系人' }]}
      >
        <Input />
      </Item>
      <Item
        label="单位联系人电话"
        name="contactphone"
        rules={[
          { pattern: checkPhoneNumber, message: '请检查单位联系人电话是否正确' },
          { required: true, message: '请输入单位联系人电话' },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱格式' },
        ]}
      >
        <Input />
      </Item>
      <Item
        label="邮政编码"
        name="postalcode"
        rules={[{ required: true, message: '请输入邮政编码' }]}
      >
        <Input />
      </Item>
      <AddressInput />
      <Button type="primary" htmlType={'submit'}>
        更改基本信息
      </Button>
    </Form>
  );
}
export default connect()(BaseMessage);
