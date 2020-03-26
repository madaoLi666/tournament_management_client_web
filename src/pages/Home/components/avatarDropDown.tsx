import React from 'react';
import styles from '../home.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Menu, message, Dropdown, Avatar } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { router } from 'umi';

interface AvatarDropDownProps extends Partial<ConnectProps> {
  currentUser?: string;
}

function AvatarDropDown(props: AvatarDropDownProps) {
  const { dispatch, currentUser } = props;

  const exit = () => {
    if (!dispatch) {
      message.error('[avatarDropDown]dispatch is undefined');
      return;
    }
    window.localStorage.clear();
    dispatch({
      type: 'user/clearState',
      payload: '',
    });
    dispatch({
      type: 'enroll/clearState',
      payload: '',
    });
    router.push('/home');
    message.info('退出登录成功');
  };

  const onMenuClick = (event: ClickParam) => {
    const { key } = event;
    if (key === 'center') {
      router.push('/user/list');
    } else if (key === 'logout') {
      exit();
    } else if (key === 'home') {
      router.push('/home');
    }
  };

  const menuDom = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {currentUser && (
        <Menu.Item key="home">
          <HomeOutlined />
          主页
        </Menu.Item>
      )}
      {currentUser && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {currentUser && <Menu.Divider />}
      {currentUser && (
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      )}
    </Menu>
  );

  const onLogin = () => {
    if (!currentUser) {
      router.push('/login');
    }
  };

  return (
    <Dropdown overlay={menuDom}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
          alt="avatar"
        />
        <span onClick={onLogin} className={styles.name}>
          {currentUser ? currentUser : '登录'}
        </span>
      </span>
    </Dropdown>
  );
}

const mapStateToProps = ({ user }: ConnectState) => {
  return {
    currentUser: user.username,
  };
};

export default connect(mapStateToProps)(AvatarDropDown);
