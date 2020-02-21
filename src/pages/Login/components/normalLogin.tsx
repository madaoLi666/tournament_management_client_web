import React, { useState, useEffect } from 'react';
import { Tabs, Input, Button, message } from 'antd';
import styles from './index.less';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { Dispatch, connect } from 'dva';
import { checkPhoneNumber } from '@/utils/regulars';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';

// 登陆的信息类型，统一来包括用户名跟密码或者是手机号跟验证码
interface LoginMsg {
  username: string;
  password: string;
}

const { TabPane } = Tabs;

interface NormalLoginProps {
  dispatch: Dispatch;
  loading?: boolean;
}

function NormalLogin(props: NormalLoginProps) {
  const { dispatch, loading } = props;
  /*
   * 'password' - 以账号名称/手机号码/邮箱登陆 + 密码 登陆
   * 'phone' - 以手机验证码方式登入
   */
  const [loginType, setLoginType] = useState('password');

  // 用户输入的登录信息
  const [loginMsg, setLoginMsg] = useState<LoginMsg>({
    username: '',
    password: '',
  });

  const [timeInterval, setTimeInterval] = useState(0);

  // 切换tabs时触发的函数
  function handleTabChange(key: string) {
    setLoginType(key);
    // 切换时清空输入
    setLoginMsg({ username: '', password: '' });
  }

  // 点击登录时触发的函数
  function login() {
    if (loginType === 'password') {
      if (loginMsg.username === '' || loginMsg.username === undefined) {
        message.warning('请填写用户名！');
        return;
      }
      if (loginMsg.password === '' || loginMsg.password === undefined) {
        message.warning('请填写密码！');
        return;
      }
    } else if (loginType === 'phone') {
      if (loginMsg.username === '' || loginMsg.username === undefined) {
        message.warning('请填写手机号！');
        return;
      }
      if (loginMsg.password === '' || loginMsg.password === undefined) {
        message.warning('请填写验证码！');
        return;
      }
      if (!checkPhoneNumber.test(loginMsg.username)) {
        message.warning('请输入正确的手机号码！');
        return;
      }
    } else {
      console.error('[normalLogin] loginMsg is undefined!');
      message.error('[normalLogin] loginMsg is undefined!');
    }
    dispatch({ type: 'login/sendLoginRequest', payload: loginMsg });
  }

  // 发送验证码操作 类型不定
  function sendCode() {
    // 60秒可发送一次
    const timeInterval: number = 60000;
    if (checkPhoneNumber.test(loginMsg.username)) {
      props.dispatch({
        type: 'login/sendPhoneNumberForCode',
        payload: {
          phonenumber: loginMsg.username,
        },
      });
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
      }, 1000);
    } else {
      message.warning('请输入正确的手机号码');
    }
  }

  useEffect(() => {
    return () => {
      clearInterval();
    };
  }, []);

  return (
    <div>
      <Tabs defaultActiveKey="password" onChange={handleTabChange}>
        <TabPane tab="密码登录" key="password">
          <div className={styles['form-input-block']}>
            <Input
              value={loginMsg.username}
              onChange={event =>
                setLoginMsg({
                  username: event.currentTarget.value,
                  password: loginMsg.password,
                })
              }
              placeholder="请输入账号/手机号码/电子邮箱"
              prefix={<UserOutlined />}
              autoComplete="off"
            />
            <Input.Password
              value={loginMsg.password}
              onChange={event =>
                setLoginMsg({
                  username: loginMsg.username,
                  password: event.currentTarget.value,
                })
              }
              onKeyDown={(event: React.KeyboardEvent<any>) => {
                if (event.keyCode === 13) {
                  login();
                }
              }}
              placeholder="请输入密码"
              prefix={<LockOutlined />}
            />
            <span>
              没有账号？
              <a onClick={() => router.push('/login/register')}>点击注册</a>
            </span>
          </div>
        </TabPane>
        <TabPane tab="免密登录" key="phone">
          <div className={styles['form-block']}>
            <Input.Group compact={true}>
              <Input
                id="phoneNumber"
                value={loginMsg.username}
                onChange={event =>
                  setLoginMsg({
                    username: event.currentTarget.value,
                    password: loginMsg.password,
                  })
                }
                placeholder="请输入手机号码"
                prefix={<MobileOutlined />}
                autoComplete="off"
              />
              <Button
                type="primary"
                onClick={sendCode}
                disabled={timeInterval !== 0}
              >
                {timeInterval === 0 ? (
                  <span>发送验证码</span>
                ) : (
                  <span>{timeInterval / 1000}秒</span>
                )}
              </Button>
            </Input.Group>
            <Input
              value={loginMsg.password}
              onChange={event =>
                setLoginMsg({
                  username: loginMsg.username,
                  password: event.currentTarget.value,
                })
              }
              onKeyDown={(event: React.KeyboardEvent<any>) => {
                if (event.keyCode === 13) {
                  login();
                }
              }}
              placeholder="请输入验证码"
              prefix={<LockOutlined />}
              autoComplete="off"
            />
            <span>
              没有账号？
              <a onClick={() => router.push('/login/register')}>点击注册</a>
            </span>
          </div>
        </TabPane>
      </Tabs>

      <div className={styles['login-btn']}>
        <Button loading={loading} type="primary" size={'large'} onClick={login}>
          登录
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = ({ loading }: ConnectState) => {
  return {
    loading: loading.models.login,
  };
};

export default connect(mapStateToProps)(NormalLogin);
