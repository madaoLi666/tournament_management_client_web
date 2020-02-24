import React from 'react';
import styles from '../index.less';
import { Button, Form, Input, message } from 'antd';
import { FormProps } from 'antd/lib/form';
import { checkEmail, checkPhoneNumber } from '@/utils/regulars';
import UploadForm from '@/components/UploadForm/uploadForm';
import { router } from 'umi';

interface UnitFormProps {
  initialValue: any;
  submitForm(data: any): void;
  loading: boolean;
  matchId: string;
}

const UnitInfoFormStyle: FormProps = {
  layout: 'horizontal',
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    md: { span: 8 },
    lg: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 10 },
    lg: { span: 8 },
  },
  colon: true,
  labelAlign: 'right',
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
  },
};

function UnitForm(props: UnitFormProps) {
  const { initialValue, submitForm, loading, matchId } = props;
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    if (!initialValue.guaranteePic && !values.uploadPic) {
      // 如果原来没有而且现在提交的表单也没有,那么是没有上传文件
      message.warning('请先上传自愿责任书!');
      return;
    }
    // 如果原先就有值，则返回空字符，否则返回originFileObj
    let formRes = {
      ...values,
      guaranteePic: values.uploadPic ? values.uploadPic[0].originFileObj : '',
    };
    submitForm(formRes);
  };

  const onFinishFailed = ({ errorFields }: any) => {
    message.error(errorFields[0].errors);
    form.scrollToField(errorFields[0].name);
  };

  return (
    <Form
      {...UnitInfoFormStyle}
      form={form}
      name={'unitForm'}
      initialValues={initialValue}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item label="单位" name="unitName">
        <Input disabled />
      </Form.Item>
      <Form.Item
        rules={[
          { required: true, message: '请输入参赛别名，可与单位名称相同' },
        ]}
        name="unitNameAlias"
        label="参赛队伍"
      >
        <Input placeholder="请输入参赛队伍名字" />
      </Form.Item>
      <Form.Item
        label="领队姓名"
        name="leaderName"
        rules={[{ required: true, message: '请输入领队姓名' }]}
      >
        <Input placeholder="请输入领队姓名" />
      </Form.Item>
      <Form.Item
        rules={[
          { required: true, message: '请输入领队联系电话' },
          { pattern: checkPhoneNumber, message: '请输入正确的国内手机号码' },
        ]}
        name={'leaderPhone'}
        label="联系电话"
      >
        <Input placeholder="请输入领队联系电话" />
      </Form.Item>
      <Form.Item
        label="领队邮箱"
        name={'leaderEmail'}
        rules={[
          { required: true, message: '请输入领队邮箱' },
          { pattern: checkEmail, message: '请输入正确的电子邮箱地址' },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <UploadForm
        guaranteePic={initialValue.guaranteePic}
        name={'uploadPic'}
        label={'自愿责任书'}
      />

      <Form.Item label="教练姓名" name={'coach1Name'}>
        <Input placeholder="选填" />
      </Form.Item>
      <Form.Item
        label="联系电话"
        name={'coach1Phone'}
        rules={[
          { pattern: checkPhoneNumber, message: '请输入正确的国内手机号码' },
        ]}
      >
        <Input placeholder="选填" />
      </Form.Item>
      <Form.Item label="教练姓名" name={'coach2Name'}>
        <Input placeholder="选填" />
      </Form.Item>
      <Form.Item
        label="联系电话"
        name={'coach2Phone'}
        rules={[
          { pattern: checkPhoneNumber, message: '请输入正确的国内手机号码' },
        ]}
      >
        <Input placeholder="选填" />
      </Form.Item>
      <div className={styles.hr} />
      <Form.Item className={styles.btn} {...tailFormItemLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          确认报名信息
        </Button>
        <Button
          onClick={() => {
            router.push('/enroll/choiceTeam/' + matchId);
          }}
          className={styles.editButton}
        >
          返回队伍选择
        </Button>
      </Form.Item>
    </Form>
  );
}

export default UnitForm;
