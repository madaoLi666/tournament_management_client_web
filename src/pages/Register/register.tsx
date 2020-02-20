import React from 'react';
import styles from './register.less';
import LoginBlock from '@/components/LoginBlock/loginBlock';
import RegisterForm from '@/pages/Register/components/registerForm';
import { Card, Tabs } from 'antd';

const { TabPane } = Tabs;

interface RegisterProps {}

function Register(props: RegisterProps) {
  return (
    <LoginBlock>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<strong>第一次登陆，注册新账号</strong>} key="1">
          <RegisterForm />
        </TabPane>
      </Tabs>
    </LoginBlock>
  );
}

export default Register;
