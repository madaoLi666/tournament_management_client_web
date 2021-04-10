import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Tabs, Input, Button, message } from 'antd';
import styles from './index.less';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { Dispatch, connect } from 'dva';
import { checkPhoneNumber } from '@/utils/regulars';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
const { TabPane } = Tabs;

interface LoginState {
  /* loginType
   * 'password' - 以账号名称/手机号码/邮箱登陆 + 密码 登陆
   * 'phone' - 以手机验证码方式登入
   */
  loginType: string;
  username: string;
  password: string;
}

interface NormalLoginProps {
  dispatch: Dispatch;
  loading?: boolean;
}

const ACTIONS = {
  SET_LOGIN_TYPE: 'setLoginType',
  SET_LOGIN_MESSAGE: 'setLoginMessage',
};

function reducer(state: LoginState, action: any) {
  switch (action.type) {
    case ACTIONS.SET_LOGIN_MESSAGE:
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
      };
    case ACTIONS.SET_LOGIN_TYPE:
      return {
        ...state,
        loginType: action.payload,
      };
    default:
      return state;
  }
}

function NormalLogin(props: NormalLoginProps) {
  const { dispatch, loading } = props;

  const [loginState, loginDispatch] = useReducer(reducer, {
    loginType: 'password',
    username: '',
    password: '',
  });

  const [timeInterval, setTimeInterval] = useState(0);

  // 切换tabs触发的函数
  function handleTabChange(key: string) {
    loginDispatch({ type: ACTIONS.SET_LOGIN_TYPE, payload: key });
    // 切换时清空输入
    loginDispatch({ type: ACTIONS.SET_LOGIN_MESSAGE, payload: { username: '', password: '' } });
  }

  // 登录触发的函数
  function login() {
    if (loginState.loginType === 'password') {
      if (loginState.username === '' || loginState.username === undefined) {
        message.warning('请填写用户名！');
        return;
      }
      if (loginState.password === '' || loginState.password === undefined) {
        message.warning('请填写密码！');
        return;
      }
    }
    if (loginState.loginType === 'phone') {
      if (loginState.username === '' || loginState.username === undefined) {
        message.warning('请填写手机号！');
        return;
      }
      if (loginState.password === '' || loginState.password === undefined) {
        message.warning('请填写验证码！');
        return;
      }
      if (!checkPhoneNumber.test(loginState.username)) {
        message.warning('请输入正确的手机号码！');
        return;
      }
    }
    if (loginState.loginType !== 'password' && loginState.loginType !== 'phone') {
      console.error('[normalLogin] loginMsg is undefined!');
      message.error('[normalLogin] loginMsg is undefined!');
      return;
    }
    dispatch({
      type: 'login/sendLoginRequest',
      payload: {
        username: loginState.username,
        password: loginState.password,
      },
    });
  }

  // 发送验证码,用一个ref保存定时器,方便在useEffect中清除
  const intervalRef = useRef<any>();
  function sendCode() {
    // 60秒可发送一次
    const timeInterval = 60000;
    if (checkPhoneNumber.test(loginState.username)) {
      dispatch({
        type: 'login/sendPhoneNumberForCode',
        payload: {
          phonenumber: loginState.username,
        },
      });
      setTimeInterval(timeInterval);
      // 计时 用于防止用户多次发送验证码
      intervalRef.current = setInterval(() => {
        setTimeInterval(timeInterval => {
          if (timeInterval === 0) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return timeInterval - 1000;
        });
      }, 1000);
    }
    if (!checkPhoneNumber.test(loginState.username)) {
      message.warning('请输入正确的手机号码');
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <Tabs defaultActiveKey="password" onChange={handleTabChange}>
        <TabPane tab="密码登录" key="password">
          <div className={styles['form-input-block']}>
            <Input
              value={loginState.username}
              onChange={event =>
                loginDispatch({
                  type: ACTIONS.SET_LOGIN_MESSAGE,
                  payload: {
                    username: event.currentTarget.value,
                    password: loginState.password,
                  },
                })
              }
              placeholder="请输入账号/手机号码/电子邮箱"
              prefix={<UserOutlined />}
              autoComplete="off"
            />
            <Input.Password
              value={loginState.password}
              onChange={event =>
                loginDispatch({
                  type: ACTIONS.SET_LOGIN_MESSAGE,
                  payload: {
                    username: loginState.username,
                    password: event.currentTarget.value,
                  },
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
                value={loginState.username}
                onChange={event =>
                  loginDispatch({
                    type: ACTIONS.SET_LOGIN_MESSAGE,
                    payload: {
                      username: event.currentTarget.value,
                      password: loginState.password,
                    },
                  })
                }
                placeholder="请输入手机号码"
                prefix={<MobileOutlined />}
                autoComplete="off"
              />
              <Button type="primary" onClick={sendCode} disabled={timeInterval !== 0}>
                {timeInterval === 0 ? (
                  <span>发送验证码</span>
                ) : (
                  <span>{timeInterval / 1000}秒</span>
                )}
              </Button>
            </Input.Group>
            <Input
              value={loginState.password}
              onChange={event =>
                loginDispatch({
                  type: ACTIONS.SET_LOGIN_MESSAGE,
                  payload: {
                    username: loginState.username,
                    password: event.currentTarget.value,
                  },
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
