import React from 'react';
import LoginBlock from '@/components/LoginBlock/loginBlock';
import RegisterForm from '@/pages/Login/components/register/registerForm';
import { Tabs } from 'antd';

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
