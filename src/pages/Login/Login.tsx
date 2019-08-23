import React, { useState } from 'react';
import {
  Card, Button, Input, Icon, Row, Col, Tabs, message
} from 'antd';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { checkPhoneNumber } from '@/utils/regulars';
// @ts-ignore
import styles from '@/pages/Login/index.less';

const { TabPane } = Tabs;

export interface SendCodeProps {
  dispatch: Dispatch<{type: string, payload: any}>;
}
// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 20 }, md: { span: 14 }, lg: { span: 12 }, xl: { span: 10 }, xxl: { span: 10 },
};

function Login(props: SendCodeProps) {
  /*
  * '0' - 以账号名称/手机号码/邮箱登陆 + 密码 登陆
  * '1' - 以手机验证码方式登入
  * '2' - 微信二维码扫描
  */
  const [mode, setMode] = useState('0');
  // 以 mode '0' 登入
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });
  // 以mode '1' 登入 - verificationCode 为 字符串的验证码
  const [phoneInfo, setPhoneInfo] = useState({phoneNumber:'',verificationCode:''});

  const [timeInterval,setTimeInterval] = useState(0);

  // onChange 绑定mode1 电话号码
  async function BindPhoneNumber(event:React.ChangeEvent<HTMLInputElement>) {
    let phone:string | undefined = event.currentTarget.value;
    // 手机号码
    setPhoneInfo({ phoneNumber: phone, verificationCode: '', });
    props.dispatch({type:'user/savePhone',payload:{phonenumber:phone}})
  }
  // 发送验证码操作 类型不定
  function sendCode() {
    // 60秒可发送一次
    const timeInterval:number = 60000;
    if(checkPhoneNumber.test(phoneInfo.phoneNumber)){
      props.dispatch({ type: 'login/sendPhoneNumberForCode', payload: phoneInfo.phoneNumber});
      // 设置state中
      setTimeInterval(timeInterval);
      // 计时 用于防止用户多次发送验证码
      let i = setInterval(() => {
        setTimeInterval(timeInterval => {
          if (timeInterval === 0) {
            clearInterval(i);
            return 0;
          }
          return timeInterval - 1000;
        });
        // if(timeInterval === 0) {
        //   clearInterval(i);
        // }
      },1000);
    }else {
      message.error('请输入正确的手机号码');
    }
  }
  // onChange 绑定mode1 电话号码的验证码
  function BindPhoneVerificationCode(event:React.ChangeEvent<HTMLInputElement>) {
    let phoneVerificationCode = event.currentTarget.value;
    setPhoneInfo({
      phoneNumber: phoneInfo.phoneNumber,
      verificationCode: phoneVerificationCode
    })
  }
  // onChange 绑定mode0 账号密码登陆
  function BindUserInfoUserName(event:React.ChangeEvent<HTMLInputElement>) {
    let username:string = event.currentTarget.value;
    setUserInfo({
      username: username,
      password: userInfo.password
    })
  }
  function BindUserInfoPassword(event:React.ChangeEvent<HTMLInputElement>) {
    let password:string = event.currentTarget.value;
    setUserInfo({
      username: userInfo.username,
      password: password
    })
  }
  // 登陆
  function login(mode: string) {
    const { dispatch } = props;
    if(mode === '0') {
      // 账号登陆
      // 判断是否有值
      if(userInfo.username !== '' && userInfo.password !== ''){
        dispatch({ type:'login/sendLoginRequest', payload: userInfo })
      }else{
        message.warning('请先填写账号与密码')
      }
    }else if(mode === '1') {
      // 检测手机验证码是否正确
      if(phoneInfo.verificationCode !== '' && phoneInfo.verificationCode !== undefined && checkPhoneNumber.test(phoneInfo.phoneNumber) ){
        dispatch({ type:'user/checkCode', payload: phoneInfo.verificationCode })
      }else{
        message.error('请输入确认输入无误后再次登陆');
      }
    }
  }

  // 获取微信二维码
  // useEffect(() => {
  //   if(mode === '2'){
  //     // @ts-ignore
  //     new window.WxLogin({
  //       self_redirect:true,
  //       id:"login_container",
  //       appid: "wx6cd193749f4c7e03",
  //       scope: "snsapi_login",
  //       redirect_uri: "https://www.gsta.top/wxLogin",
  //       state: "abc",
  //       style: "white",
  //       href: ""
  //     });
  //   }
  // });

  return (
    <div className={styles['login-page']}>
      <Row justify='center' type='flex'>
        <Col {...autoAdjust}>
          <div className={styles['login-block']}>
            <Card
              style={{ width: '100%', height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111' }}
              headStyle={{ color: '#2a8ff7' }}
            >
              <Tabs onChange={(key:string) => setMode(key)}>
                <TabPane tab="用户登陆" key="0">
                  <div className={styles['form-input-block']}>
                    <Input onChange={BindUserInfoUserName} placeholder='请输入账号/手机号码/电子邮箱' prefix={<Icon type="user"/>} style={{height: '40px'}} autoComplete='off' />
                    <Input.Password onChange={BindUserInfoPassword} placeholder='请输入密码'  prefix={<Icon type="lock"/>} style={{height: '40px'}} />
                  </div>
                </TabPane>
                <TabPane tab="手机验证登陆" key="1">
                  <div className={styles['form-input-block']}>
                    <Input.Group compact={true}>
                      <Input id="phoneNumber" onChange={BindPhoneNumber} placeholder='请输入手机号码' prefix={<Icon type="mobile"/>} style={{ height: '40px', width: '70%' }} autoComplete='off' />
                      <Button
                        type="primary"
                        onClick={sendCode}
                        style={{ height: '40px', width: '30%' }}
                        disabled={timeInterval !== 0}
                      >
                        {timeInterval === 0 ? <span>发送验证码</span> : <span>{timeInterval/1000}秒</span>}
                      </Button>
                    </Input.Group>
                    <Input onChange={BindPhoneVerificationCode} placeholder='请输入验证码' prefix={<Icon type="lock"/>} style={{ height: '40px' }} autoComplete='off' />
                  </div>
                </TabPane>
                {/* <TabPane tab="微信扫码" key="2">
                  <div id='login_container' />
                </TabPane> */}
              </Tabs>
              {/* { mode!== '2' ? (
                <div className={styles['login-btn']}>
                  <Button onClick={() => login(mode)} style={{ width: '100%', height: '40px', position: 'relative', bottom: '0' }} type='primary' >
                    登陆
                  </Button>
                </div>
              ) : <h4>--&nbsp;&nbsp;请扫码登陆&nbsp;&nbsp;--</h4>} */}
              <div className={styles['login-btn']}>
                <Button onClick={() => login(mode)} style={{ width: '100%', height: '40px', position: 'relative', bottom: '0' }} type='primary' >
                  登陆
                </Button>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
// 手机验证码登陆的 connect
export default connect()(Login);
