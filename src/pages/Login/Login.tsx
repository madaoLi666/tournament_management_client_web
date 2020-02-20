import React from 'react';
import { Dispatch, connect } from 'dva';
import { Row, Col, Card, Button } from 'antd';
import styles from './login.less';
import NormalLogin from './components/normalLogin';

// Col 自适应
const autoAdjust = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 14 },
  lg: { span: 12 },
  xl: { span: 10 },
  xxl: { span: 10 },
};

interface LoginProps {
  dispatch: Dispatch;
}

function Login(props: LoginProps) {
  return (
    <div className={styles['login-page']}>
      <Row justify="center">
        <Col {...autoAdjust}>
          <div className={styles['login-block']}>
            <Card className={styles.cardBlock} headStyle={{ color: '#2a8ff7' }}>
              <NormalLogin />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default connect()(Login);
