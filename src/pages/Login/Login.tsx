import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Card,Button,Input,Icon,Row, Col
} from 'antd';
// @ts-ignore
import styles from '@/pages/Login/index.less';
import { Dispatch } from 'redux';
import { connect } from 'dva';

export interface SendCodeProps {
  dispatch: Dispatch<{type: string, payload: any}>;
}

// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
};

function Login(props:SendCodeProps) {
  /*
  * 设置是 个人登陆还是团队登陆
  * '0' - 以账号名称/手机号码/邮箱登陆 + 密码 登陆
  * '1' - 以手机验证码方式登入
  * '2' - 微信二维码扫描
  */
  const [mode, setMode] = useState('0');
  // 以 mode '0' 登入
  const [userInfo ,setUserInfo] = useState({username:'',password:''});
  // 以mode '1' 登入 - verificationCode 为 字符串的验证码
  const [phoneInfo, setPhoneInfo] = useState({phoneNumber:'',verificationCode:''});
  // onChange 绑定mode1 电话号码
  function BindPhoneNumber(event:React.ChangeEvent<HTMLInputElement>) {
    var phone:string | undefined = event.currentTarget.value;
    if (typeof phone === 'undefined') {
      alert('您输入了错误的手机号码信息')
      return
    }
    if ( (/^[0-9]*$/.test(phone)) === false) {
      alert('您输入了错误的手机号码信息')
    }
    setPhoneInfo(
      {
        phoneNumber : phone,
        verificationCode : ''
      }
    )
  }
  // 发送验证码操作 类型不定
  function sendCode(event: React.MouseEvent<HTMLButtonElement>) {
    props.dispatch({
      type: 'login/sendVerification2Phone',
      payload: phoneInfo.phoneNumber
    })
    // TODO 返回正确的验证码
  };
  // onChange 绑定mode1 电话号码的验证码
  function BindPhoneVerificationCode(event:React.ChangeEvent<HTMLInputElement>) {
    var phoneVerificationCode = event.currentTarget.value;
    setPhoneInfo({
      phoneNumber: phoneInfo.phoneNumber,
      verificationCode: phoneVerificationCode
    })
  }
  // mode1 登陆按钮函数
  function loginWithMode1(event:React.MouseEvent<HTMLButtonElement>) {
    // TODO验证是否正确
  }
  // onChange 绑定mode0 账号密码登陆
  function BindUserInfoUserName(event:React.ChangeEvent<HTMLInputElement>) {
    var username:string = event.currentTarget.value;
    setUserInfo({
      username: username,
      password: userInfo.password
    })
  }
  function BindUserInfoPassword(event:React.ChangeEvent<HTMLInputElement>) {
    var password:string = event.currentTarget.value;
    setUserInfo({
      username: userInfo.username,
      password: password
    })
  }
  // 以mode '0' 登陆的函数
  function loginWithMode0(event:React.MouseEvent<HTMLButtonElement>) {
    props.dispatch({
      type:'login/sendLoginRequser',
      payload: userInfo
    })
  };
  // 根据不相同的mode渲染 对应的DOM
  let formDOM: React.ReactNode = mode === '0' ? (
    <div className={styles['form-input-block']}>
      <Input onChange={BindUserInfoUserName} placeholder='请输入账号/手机号码/电子邮箱' prefix={<Icon type="user"/>} style={{height: '40px'}} />
      <Input.Password onChange={BindUserInfoPassword} placeholder='请输入密码'  prefix={<Icon type="lock"/>} style={{height: '40px'}} />
      <Button onClick={loginWithMode0} style={{width: '100%', height: '40px'}} type='primary'>
        登陆
      </Button>
    </div>

  ) : (
    <div className={styles['form-input-block']}>
      <div style={{display:'flex'}}>
      <Input id="phoneNumber" onChange={BindPhoneNumber} placeholder='请输入手机号码' prefix={<Icon type="mobile"/>} style={{height: '40px'}}  />
      <Button type="primary" onClick={sendCode} style={{height:40}}>发送验证码</Button>
      </div>
      <Input onChange={BindPhoneVerificationCode} placeholder='请输入验证码' prefix={<Icon type="lock"/>} style={{height: '40px'}}  />
      <Button style={{width: '100%', height: '40px'}} type='primary'>
        登陆
      </Button>
    </div>
  );

  return (
    <div className={styles['login-page']}>
      <Row justify='center' type='flex'>
        <Col {...autoAdjust}>
          <div className={styles['login-block']}>
            <Card
              style={{width: '100%',height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111'}}
              headStyle={{color: '#2a8ff7'}}
              title='赛事报名通道登录平台'
            >
              <div style={{ paddingTop: '10px' }}>
                {formDOM}
                <p>
                  ——&nbsp;&nbsp; <strong>其他登陆方式</strong> &nbsp;&nbsp;——
                </p>
                <div className={styles['icon-group-block']}>
                  排布图标 用于切换登陆的方式

                  {/* 在linter中有限制  */}
                  {mode === '0' ?
                    <div>
                      <Button onClick={() => {setMode('1')}}>手机短信验证登陆</Button>
                      <Button onClick={() => {setMode('2')}}>二维码登陆</Button>
                    </div>
                  :
                    <div>
                      <Button onClick={() => {setMode('0')}}>电话/邮箱/用户名 + 密码登陆</Button>
                      <Button onClick={() => {setMode('2')}}>二维码登陆</Button>
                    </div>
                  }


                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = (phoneNumber: string) => {
  return phoneNumber;
}

const loginMapStateToProps = (state:{username:string,passowrd:string}) => {
  return state;
}

// 账号密码登陆的 connect
connect(loginMapStateToProps)(Login);
// 手机验证码登陆的 connect
export default connect(mapStateToProps)(Login);
