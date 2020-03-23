import React from 'react';
import styles from '../index.less';
import LoginBlock from '@/components/LoginBlock/loginBlock';
import { Dispatch } from 'dva';
import { router } from 'umi';
import { Button } from 'antd';

interface SetRoleProps {
  dispatch: Dispatch;
}

function SetRole(props: SetRoleProps) {
  const { dispatch } = props;
  const showDeleteConfirm = () => {};

  function toSetRole(key: number) {
    if (key === 1) {
      dispatch({ type: 'register/setAthleteRole' });
    } else if (key === 2) {
      router.push('/complete/2');
    }
  }

  return (
    <LoginBlock>
      <div className={styles['btn-block']}>
        <Button style={{ width: '100%', height: 'auto' }} onClick={showDeleteConfirm} disabled>
          运动员本人 或 运动员家长
          <br />
          目前比赛不支持个人报名
        </Button>
        <h1>或</h1>
        <Button
          style={{ width: '100%', height: 'auto' }}
          type="primary"
          onClick={() => toSetRole(2)}
        >
          单位（协会/俱乐部）负责人
          <br />
          领队或教练
        </Button>
      </div>
      <br />
      <div style={{ color: 'red' }}>
        {/*<p>如你不是领队等请不要点此键，并不要胡乱注册新单位！</p>*/}
        <p>在新注册单位时，本平台将收取一定服务费用，敬请留意！</p>
      </div>
    </LoginBlock>
  );
}

export default SetRole;
