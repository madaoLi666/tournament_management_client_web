import React, { useState } from 'react';
import styles from './index.less';
import { router } from 'umi';
import { Layout, message } from 'antd';
import { connect, Dispatch } from 'dva';
import AvatarDropDown from '@/pages/Home/components/avatarDropDown';

const { Header } = Layout;

interface HeaderMsgProps {
  dispatch: Dispatch;
}

function HeaderMsg(props: HeaderMsgProps) {
  const { dispatch } = props;
  const [token, setToken] = useState(window.localStorage.getItem('TOKEN'));

  const exit = () => {
    window.localStorage.clear();
    setToken(null);
    props.dispatch({
      type: 'user/clearState',
      payload: '',
    });
    props.dispatch({
      type: 'enroll/clearState',
      payload: '',
    });
    router.push('/home');
    message.info('退出登录成功');
  };

  return (
    <Header className={styles.header}>
      <div className={styles.header_left}>
        <strong>
          <div>
            <img onClick={() => router.push('/home')} src={require('@/assets/logo1.png')} alt="" />
            <span className={styles.title}>
              <a onClick={() => router.push('/home')}>轮滑赛事辅助系统平台</a>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <a
            className={styles.header_block}
            onClick={() =>
              window.open(
                'https://www.gsta.top/nstatic/react/%E6%8A%A5%E5%90%8D%E6%AD%A5%E9%AA%A4_6fDXGU2.html',
              )
            }
          >
            报名步骤查看
          </a>
        </strong>
      </div>
      <div className={styles.header_right}>
        <AvatarDropDown />
      </div>
    </Header>
  );
}

export default connect()(HeaderMsg);
