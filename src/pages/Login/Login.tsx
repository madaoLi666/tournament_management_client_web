import React from 'react';
import NormalLogin from './components/normalLogin';
import LoginBlock from '@/components/LoginBlock/loginBlock';

// Col 自适应
const autoAdjust = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 14 },
  lg: { span: 12 },
  xl: { span: 10 },
  xxl: { span: 10 },
};

interface LoginProps {}

function Login(props: LoginProps) {
  return (
    <LoginBlock>
      <NormalLogin />
    </LoginBlock>
  );
}

export default Login;
