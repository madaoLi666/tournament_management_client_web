import React, { useState } from 'react';
import styles from '../index.less';
import { Dispatch, connect } from 'dva';
import { Button, Form, Input, message } from 'antd';
import AvatarView from '@/pages/PersonBackground/UnitAdmin/components/uploadMainpart';

const { Item } = Form;

interface MainpartMessageProps {
  dispatch: Dispatch;
  current_main_part?: string;
  businesslicense: string;
  unitdata_id?: number;
  loading?: boolean;
}

function MainPartMessage(props: MainpartMessageProps) {
  const { dispatch, businesslicense, current_main_part, loading, unitdata_id } = props;
  const [upLoadFile, setFile] = useState<any>('');

  const onFinish = (values: any) => {
    let formData = new FormData();
    formData.append('mainpart', values.mainpart);
    formData.append('unitdata_id', String(unitdata_id));
    formData.append('businesslicense', upLoadFile);
    props.dispatch({
      type: 'unit/changeUnitMainPart',
      payload: formData,
      callback: (res: boolean) => {
        if (res) {
          props.dispatch({ type: 'user/getAccountData' });
        }
      },
    });
  };

  function getFile(file: any, legal: { current: boolean }) {
    if (!legal.current) {
      return;
    }
    message.success('已成功上传营业执照，请输入主体名称后点击更改营业执照信息');
    setFile(file.originFileObj);
  }

  return (
    <Form
      onFinish={onFinish}
      layout="vertical"
      hideRequiredMark
      initialValues={{
        mainpart: current_main_part,
      }}
    >
      <Item>
        <AvatarView
          getFile={getFile}
          avatar={
            businesslicense === null
              ? 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
              : businesslicense
          }
        />
      </Item>
      <Item
        label={'主体名称'}
        name={'mainpart'}
        rules={[{ required: true, message: '请输入主体名称' }]}
      >
        <Input />
      </Item>
      <Button type="primary" loading={loading} htmlType="submit">
        更改营业执照信息
      </Button>
    </Form>
  );
}

export default connect()(MainPartMessage);
