import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import { message, Row, Col, Button, Input, Card, Tabs, Icon } from 'antd';
import { connect } from 'dva';
import { checkPhoneNumber } from '@/utils/regulars';

const { TabPane } = Tabs;

// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
};

function MobileValidate(props: any) {

  const [ phone,setPhone ] = React.useState('');
  const [ code,setCode ] = React.useState('');
  const [timeInterval,setTimeInterval] = React.useState(0);

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
    if (!checkPhoneNumber.test(phone)) {
      message.warning("请检查手机号码是否正确");
      return
    }
    props.dispatch({
      type: 'login/sendPhoneNumberForCode',
      payload: phone
    })
    const timeInterval:number = 60000;
    setTimeInterval(timeInterval);
    let counts = 0;
    // 计时 用于防止用户多次发送验证码
    let i = setInterval(() => {
      setTimeInterval(timeInterval => timeInterval-1000);
      counts++;
      if(counts === 60) {
        clearInterval(i);
      }
    },1000);
  }
  // 验证
  function validateCode(event: React.MouseEvent<HTMLElement>) {
    if (code === "" || code === undefined) {
      message.error("验证码不可为空！");
      return
    }
    if (phone === "" || phone === undefined) {
      message.error("手机号码不可为空！");
      return
    }
    if (!checkPhoneNumber.test(phone)) {
      message.warning("请检查手机号码是否正确");
      return
    }
    props.dispatch({
      type: 'user/checkCode',
      payload: code
    })
  }

  // 标签页DOM
  let TabsDOM: React.ReactNode = (
    <Tabs>
      <TabPane tab={<strong>手机验证</strong>} key="1">
          <Input.Group compact={true} style={{width:"100%"}}  >
            <Input onChange={BindPhone} style={{width:"60%",height:40,marginTop:"5%"}} placeholder="请输入手机号码" prefix={<Icon type="mobile" />} />
            {timeInterval === 0 ?
            <Button onClick={sendCode} style={{width:"40%",height:40,marginTop:"5%"}} type="primary" >发送验证码</Button>
            :<Button type="primary" style={{width:"40%",height:40,marginTop:"5%"}} disabled={true} >{timeInterval/1000}秒</Button>
            }
          </Input.Group>
          <Input onChange={BindCode} prefix={<Icon type="lock" />} style={{marginTop:"10%"}} placeholder="请输入验证码" size="large" />
          <Button onClick={validateCode} type="primary" size="large" style={{marginTop:"10%"}} block={true} >验证</Button>
      </TabPane>
    </Tabs>
  );


  return (
    <div className={styles['validate-page']}>
      <Row style={{height:"500px"}} justify="center" type="flex">
        <Col {...autoAdjust}>
          <div className={styles['validate-block']}>
            <Card
              style={{ width: '126%', height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111' }}
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
