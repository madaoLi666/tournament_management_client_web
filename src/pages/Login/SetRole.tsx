import React from 'react';
import {
  Row, Col, Button, Card
} from 'antd';
import { connect, DispatchProp } from 'dva';
// @ts-ignore
import styles from './index.less';

// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
};

function SetRole({dispatch}:DispatchProp) {

  function toSetRole(key:number){
    if(key === 1){
      dispatch({type: 'register/setAthleteRole'});
    }else if(key === 2){

    }
  }

  return (
    <div className={styles['set-role']}>
      <Row justify='center' type='flex'>
        <Col {...autoAdjust}>
          <Card
            style={{ width: '100%', height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111' }}
            headStyle={{ color: '#2a8ff7'}}
            title='请选择你的角色身份'
          >
            <div className={styles['btn-block']}>
              <Button style={{width: '100%'}} type='primary' onClick={() => toSetRole(1)}>运动员本人 或 运动员家长</Button>
              <h1>或</h1>
            <Button style={{width: '100%'}} onClick={() => toSetRole(2)}>单位（协会/俱乐部）负责人、领队或教练</Button>
            </div>
            <br/>
            <div style={{color: 'red'}}>
              <p>如你不是领队等请不要点此键，并不要胡乱注册新单位！</p>
              <p>在新注册单位时，本平台将收取一定服务费用，敬请留意！</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default connect()(SetRole);
