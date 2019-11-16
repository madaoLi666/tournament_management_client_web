import React from 'react';
import {
  Row, Col, Button, Card, Modal
} from 'antd';
import router from 'umi/router';
import { connect, DispatchProp } from 'dva';
// @ts-ignore
import styles from './index.less';

const { confirm } = Modal;

// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
};

function SetRole({dispatch}:DispatchProp) {

  const message_tips:React.ReactNode = (
    <p style={{color:'red'}}>注：个人帐号目前暂不提供赛事报名，如需报名参赛请选择注册单位帐号！</p>
  )

  function showDeleteConfirm() {
    confirm({
      title: '确认选择个人账号吗？',
      content: message_tips,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        toSetRole(1);
      },
      onCancel() {
        ;
      },
    });
  }

  function toSetRole(key:number){
    if(key === 1){
      dispatch({type: 'register/setAthleteRole'});
    }else if(key === 2){
      router.push('/login/bindUnit');
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
              <Button style={{width: '100%',height:'auto'}} onClick={showDeleteConfirm}disabled >运动员本人 或 运动员家长<br/>目前比赛不支持个人报名</Button>
              <h1>或</h1>
            <Button style={{width: '100%',height:'auto'}} type='primary' onClick={() => toSetRole(2)}>单位（协会/俱乐部）负责人<br/>领队或教练</Button>
            </div>
            <br/>
            <div style={{color: 'red'}}>
              {/*<p>如你不是领队等请不要点此键，并不要胡乱注册新单位！</p>*/}
              <p>在新注册单位时，本平台将收取一定服务费用，敬请留意！</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default connect()(SetRole);
