import React from 'react';
import styles from '../home.less';
import { connect } from 'dva';
import { ConnectState, ConnectProps } from '@/models/connect';
import { Menu, message, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { router } from 'umi';

interface AvatarDropDownProps extends Partial<ConnectProps> {
  currentUser?: string;
  color?: string; // 在个人中心里面的字体颜色和主页的主体颜色不同
}

function AvatarDropDown(props: AvatarDropDownProps) {
  const { dispatch, currentUser, color } = props;

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

  const onMenuClick = (event: any) => {
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
      <span className={`${styles.action} ${styles.account}`} onClick={onLogin}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
          alt="avatar"
        />
        <span
          className={styles.name}
          style={color ? { color: 'rgba(0, 0, 0, 0.65)' } : { color: '#ffffff' }}
        >
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
