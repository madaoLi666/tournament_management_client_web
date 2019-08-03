import React, { useState, useEffect } from 'react';
import {
  Card,Button,Input,Icon,Row, Col,
} from 'antd';
// @ts-ignore
import styles from '@/pages/Login/index.less';
import axiosInstance from './../../utils/request';


// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
};

function Login(): React.ReactNode {
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
  // 发送验证码操作
  function sendCode() {
    console.log('我发送了验证码请求');
    var api = 'http://47.106.15.217:9090/phoneCode?phonenumber=1560221889'
    axiosInstance.get(api)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  // 根据不相同的mode渲染 对应的DOM
  let formDOM: React.ReactNode = mode === '0' ? (
    <div className={styles['form-input-block']}>
      <Input placeholder='请输入账号/手机号码/电子邮箱' prefix={<Icon type="user"/>} style={{height: '40px'}} />
      <Input.Password placeholder='请输入密码'  prefix={<Icon type="lock"/>} style={{height: '40px'}} />
      <Button style={{width: '100%', height: '40px'}} type='primary'>
        登陆
      </Button>
    </div>

  ) : (
    <div className={styles['form-input-block']}>
      <div style={{display:'flex'}}>
      <Input placeholder='请输入手机号码' prefix={<Icon type="mobile"/>} style={{height: '40px'}}  />
      <Button type="primary" onClick={sendCode} style={{height:40}}>发送验证码</Button>
      </div>
      <Input placeholder='请输入验证码' prefix={<Icon type="lock"/>} style={{height: '40px'}}  />
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

export default Login;
