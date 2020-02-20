import React from 'react';
import { Row, Col, Card } from 'antd';
import styles from './index.less';

// Col 自适应
const autoAdjust = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 14 },
  lg: { span: 12 },
  xl: { span: 10 },
  xxl: { span: 10 },
};

export default function LoginBlock(props: any) {
  return (
    <div className={styles['login-page']}>
      <Row justify="center">
        <Col {...autoAdjust}>
          <div className={styles['login-block']}>
            <Card className={styles.cardBlock} headStyle={{ color: '#2a8ff7' }}>
              {props.children}
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
