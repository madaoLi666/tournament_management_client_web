import React, { useEffect, useState } from 'react';
import styles from '../index.less';
import { connect, Dispatch } from 'dva';
import LoginBlock from '@/components/LoginBlock/loginBlock';
import { Button, Form, Input, message, Modal, Tabs } from 'antd';
import IdForm from '@/components/athleteForm/components/idForm';
import { newUnitAccount } from '@/services/registerServices';
import { checkPhoneNumber } from '@/utils/regulars';
import AddressInput from '@/components/AddressInput/addressInput';
import { ConnectState } from '@/models/connect';
import { checkUnitIsPay, getQRCodeForUnitRegister } from '@/services/payServices';
import { router } from 'umi';

const { TabPane } = Tabs;
const { Item } = Form;

interface UnitMessageProps {
  dispatch: Dispatch;
  loading: boolean;
  userId?: number;
  unitId?: number;
  history: any;
}

const BasicInfoSupplementStyle = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: { span: 7 },
    lg: { span: 7 },
    xl: { span: 6 },
    xxl: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
  colon: true,
};

function UnitMessage(props: UnitMessageProps) {
  const { dispatch, userId, loading, unitId, history } = props;
  const [validStatus, setValidStatus] = useState<
    '' | 'error' | 'success' | 'warning' | 'validating'
  >('');

  // modal的visible
  const [visible, setVisible] = useState(false);
  // 图片
  const [picUrl, setPicUrl] = useState('');

  // 校验单位名称是否重复
  async function checkUnitName(
    unitName: string,
  ): Promise<{ data: string; error: string; notice: string }> {
    return await newUnitAccount({ name: unitName });
  }

  // 判断是否已经支付费用
  async function checkoutIsPay(): Promise<any> {
    let res = await checkUnitIsPay({ user: userId });
    if (res) {
      await dispatch({ type: 'complete/modifyUnitRegisterPayCode', payload: { payCode: res } });
      return true;
    } else {
      return false;
    }
  }
  // 获取支付二维码图片
  async function getPayQRCodeUrl(): Promise<any> {
    let res = await getQRCodeForUnitRegister({ user: userId }).then(res => res);
    if (res) {
      return res;
    } else {
      return false;
    }
  }
  // 打开模态框
  const openDialog = (unitData: any) => {
    const { dispatch } = props;

    // 打开modal展示图片同时进行轮询
    setVisible(true);
    let i = setInterval(() => {
      checkoutIsPay().then(res => {
        if (res) {
          // 如果支付了 先关闭模态框
          setVisible(false);
          clearInterval(i);
          dispatch({ type: 'complete/registerUnitAccount', payload: { unitData: unitData } });
        }
      });
    }, 2000);
  };

  async function onFinish(data: any) {
    // 发起请求检查是否支付了费用
    let isPay = await checkoutIsPay().then(res => res);
    if (!isPay) {
      // 获取支付二维码
      let pic = await getPayQRCodeUrl().then(res => res);
      if (pic) {
        setPicUrl(pic);
        openDialog({ userId: userId, ...data });
      } else {
        message.error('获取支付二维码失败');
      }
    } else {
      dispatch({
        type: 'complete/registerUnitAccount',
        payload: { unitData: { userId: userId, ...data } },
      });
    }
  }

  useEffect(() => {
    const route = history.location.pathname;
    const type = history.location.query.type;
    if (unitId && unitId != 0 && route === '/complete' && type === 1) {
      message.info('您已完成账号注册！');
      router.push({
        pathname: '/complete',
        query: {
          type: 2,
        },
      });
    }
  }, [unitId]);

  return (
    <LoginBlock>
      <Tabs>
        <TabPane tab={<div>单位信息</div>} key="1">
          <Form onFinish={onFinish} {...BasicInfoSupplementStyle}>
            <Item
              name={'unitName'}
              label={'单位名称'}
              validateFirst={true}
              validateTrigger="onBlur"
              hasFeedback
              validateStatus={validStatus}
              rules={[
                { required: true, message: '请输入单位名称' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (value === '' || value === undefined) {
                      setValidStatus('error');
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
            >
              <Input placeholder={'请输入单位名称'} aria-autocomplete={'none'} />
            </Item>
            <Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
                {
                  min: 10,
                  message: '密码长度至少10位',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder={'密码长度至少10位'} />
            </Item>

            <Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '请再次输入密码!',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两个密码不相同!');
                  },
                }),
              ]}
            >
              <Input.Password placeholder={'请再次输入密码'} />
            </Item>
            <Item
              name={'contact'}
              label={'联系人'}
              rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
              <Input placeholder={'请输入联系人姓名'} />
            </Item>
            <Item
              name={'phone'}
              label={'手机号码'}
              rules={[
                { required: true, message: '请输入手机号码' },
                { pattern: checkPhoneNumber, message: '请输入正确的手机号码' },
              ]}
            >
              <Input placeholder="请输入手机号码" />
            </Item>
            <Item
              name="email"
              label="邮箱"
              rules={[
                {
                  type: 'email',
                  message: '请输入正确的邮箱格式!',
                },
                {
                  required: true,
                  message: '请输入您的邮箱!',
                },
              ]}
            >
              <Input placeholder={'请输入您的邮箱'} />
            </Item>
            <AddressInput require={true} />
            <Item
              name={'postalCode'}
              label={'邮政编码'}
              rules={[{ required: true, message: '请输入邮政编码' }]}
            >
              <Input placeholder="请输入邮政编码" />
            </Item>
            <Button type="primary" htmlType={'submit'} loading={loading} block>
              确定
            </Button>
          </Form>
        </TabPane>
      </Tabs>
      <Modal
        visible={visible}
        style={{ textAlign: 'center' }}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div>
          <img src={picUrl} alt="" />
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4>--&nbsp;&nbsp;请扫码支付平台服务信息费（0.01元）&nbsp;&nbsp;--</h4>
        </div>
      </Modal>
    </LoginBlock>
  );
}

const mapStateToProps = ({ user, loading }: ConnectState) => {
  if (user.unitData && user.unitData[0].id) {
    const unit = user.unitData[0];
    return {
      userId: user.id,
      loading: loading.global,
      unitId: unit.id,
    };
  }
  return {
    userId: user.id,
    loading: loading.global,
  };
};

export default connect(mapStateToProps)(UnitMessage);
