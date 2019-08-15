import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import { message, Row, Col, Button, Input, Card, Tabs, Icon, Statistic } from 'antd';
import { connect } from 'dva';
import { delay } from 'q';

const { TabPane } = Tabs;
const { Countdown } = Statistic;

// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
};

function MobileValidate(props: any) {

  const [ phone,setPhone ] = React.useState('');
  const [ isSending,setIsSengding ] = React.useState(false);
  const [ code,setCode ] = React.useState('');

  // onChange 绑定手机号码
  function BindPhone(event: React.ChangeEvent<HTMLInputElement>) {
    setPhone(event.currentTarget.value);
  }
  // onChange 绑定验证码
  function BindCode(event: React.ChangeEvent<HTMLInputElement>) {
    setCode(event.currentTarget.value);
  }

  // 发送验证码
  function sendCode(event: React.MouseEvent<HTMLElement>) {
    if (phone === "" || phone === undefined) {
      message.error("手机号码不可为空！");
      return
    }
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
      message.warning("请检查手机号码是否正确");
      return
    }
    props.dispatch({
      type: 'login/sendPhoneNumberForCode',
      payload: phone
    })
    setIsSengding(true);
  }
  // 验证
  async function validateCode(event: React.MouseEvent<HTMLElement>) {
    if (code === "" || code === undefined) {
      message.error("验证码不可为空！");
      return
    }
    if ( code.length !== 6 ) {
      message.warning("请检查验证码格式是否正确！");
      return
    }
    props.dispatch({
      type: 'user/checkCode',
      payload: code
    })
    // 延迟等待state修改
    await delay(40);
    if (props.userInfo.errorstate) {
      message.error(props.userInfo.errorstate);
    }  
    props.dispatch({type: 'user/clearError'})
  }
  function onFinish() {
    setIsSengding(false);
  }
  // 倒计时时间
  const deadline = Date.now()+ 10 * 60 * 25 * 4;
  let timeCountDown:React.ReactNode = (
    <div>
      <Countdown prefix={<Icon type="loading" />} value={deadline} onFinish={onFinish} format="s秒" />
    </div>
  )

  // 标签页DOM
  let TabsDOM: React.ReactNode = (
    <Tabs>
      <TabPane tab={<strong>手机验证</strong>} key="1">
          <Input.Group compact={true} style={{width:"100%"}}  >
            <Input onChange={BindPhone} style={{width:"60%",height:40}} placeholder="请输入手机号码" prefix={<Icon type="mobile" />} />
            {isSending === false ?
            <Button onClick={sendCode} style={{width:"40%",height:40}} type="primary" >发送验证码</Button>
            :<Button type="primary" style={{width:"40%",height:40}} disabled={true} >{timeCountDown}</Button>
            }
          </Input.Group>
          <Input onChange={BindCode} prefix={<Icon type="lock" />} style={{marginTop:"10%"}} placeholder="请输入验证码" size="large" />
          <Button onClick={validateCode} type="primary" size="large" style={{marginTop:"10%"}} block={true} >验证</Button>
      </TabPane>
    </Tabs>
  );


  return (
    <div className={styles['validate-page']}>
      <Row justify="center" type="flex">
        <Col {...autoAdjust}>
          <div className={styles['validate-block']}>
            <Card
              style={{ width: '100%', height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111' }}
              headStyle={{ color: '#2a8ff7' }}
            >
              {TabsDOM}
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

function userStateToProps(state: any) {
  return { userInfo: state.user }
}

export default connect(userStateToProps)(MobileValidate);
