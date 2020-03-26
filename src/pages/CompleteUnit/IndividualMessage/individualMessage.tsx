import React, { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import { connect, Dispatch } from 'dva';
import LoginBlock from '@/components/LoginBlock/loginBlock';
import { Button, Form, Input, message, Tabs } from 'antd';
import IdForm from '@/components/athleteForm/components/idForm';
import moment from 'dayjs';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';

const { Item } = Form;
const { TabPane } = Tabs;

// 表单样式
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

interface IndividualMessageProps {
  dispatch: Dispatch;
  userId?: number;
  loading: boolean;
  userData?: any;
}

function IndividualMessage(props: IndividualMessageProps) {
  const { dispatch, userId, loading, userData } = props;
  const formRef = useRef<any>({});

  const onFinish = (value: any) => {
    if (userId) {
      dispatch({
        type: 'complete/addAthleteBaseInfo',
        payload: {
          ...value,
          user: userId,
        },
      });
    } else {
      message.error('[individualMessage]userId is undefined');
    }
  };

  useEffect(() => {
    // 因为这三个组件是同时加载的，所以加个判断是否补全了第一个先
    // if (!userData) {
    //   router.push({
    //     pathname: '/complete',
    //     query: {
    //       type: 0,
    //     },
    //   });
    // }
    // 用这种方式设置表单初始值，不可以用initialValues
    if (formRef.current) {
      formRef.current.setFieldsValue(userData);
    }
  }, [userData]);

  return (
    <LoginBlock>
      <Tabs>
        <TabPane tab={<div>基本信息</div>} key="1">
          <Form
            // initialValues={userData}
            onFinish={onFinish}
            ref={formRef}
            {...BasicInfoSupplementStyle}
            labelAlign="right"
          >
            <Item label="姓名" name="name" rules={[{ required: true, message: '请输入真实姓名' }]}>
              <Input placeholder={'请输入您的真实姓名'} />
            </Item>
            <IdForm isAdd={true} formRef={formRef} />
            <Button loading={loading} type="primary" htmlType="submit" block>
              下一步
            </Button>
          </Form>
        </TabPane>
      </Tabs>
    </LoginBlock>
  );
}

const mapStateToProps = ({ user, loading }: ConnectState) => {
  // user.id != 0代表一次请求都没发过，即没有登录
  // console.log(user);
  if (user.id !== 0 && user.athleteData && user.athleteData[0].id) {
    return {
      userId: user.id,
      loading: loading.global,
      userData: {
        name: user.athleteData[0].name,
        sex: user.athleteData[0].sex,
        idCardType: user.athleteData[0].idcardtype,
        identifyNumber: user.athleteData[0].idcard,
        birthday: moment(user.athleteData[0].birthday),
      },
    };
  }

  return {
    userId: user.id,
    loading: loading.global,
    userData: {},
  };
};

export default connect(mapStateToProps)(IndividualMessage);
