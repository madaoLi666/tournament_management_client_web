import React from 'react';
import styles from './index.less';
import { router } from 'umi';
import { Layout } from 'antd';
import { connect } from 'dva';
import AvatarDropDown from '@/pages/Home/components/avatarDropDown';

const { Header } = Layout;

// 广东省轮滑协会logo
const GDLogo = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/img/logo2.png';

function HeaderMsg() {
  return (
    <Header className={styles.header}>
      <div className={styles.header_left}>
        <strong>
          <div>
            <img onClick={() => router.push('/home')} src={GDLogo} alt="" />
            <span className={styles.title}>
              <a onClick={() => router.push('/home')}>轮滑赛事辅助系统平台</a>
            </span>
          </div>
          {/* <a
            className={styles.header_block}
            onClick={() =>
              window.open(
                'https://www.gsta.top/nstatic/react/%E6%8A%A5%E5%90%8D%E6%AD%A5%E9%AA%A4_6fDXGU2.html',
              )
            }
          >
            报名步骤查看
          </a> */}
        </strong>
      </div>
      <div className={styles.header_right}>
        <AvatarDropDown />
      </div>
    </Header>
  );
}

export default connect()(HeaderMsg);
