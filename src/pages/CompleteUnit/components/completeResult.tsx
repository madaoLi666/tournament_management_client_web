import React, { useEffect } from 'react';
import { Button, message, Result } from 'antd';
import { router } from 'umi';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';

function CompleteResult(props: { unitAccount?: number }) {
  // 检测是否已经完成了补全
  useEffect(() => {
    if (props.unitAccount && props.unitAccount === 0) {
      message.warning('请先补全信息');
      router.push({
        pathname: '/complete',
        query: {
          type: 0,
        },
      });
    }
  }, [props.unitAccount]);

  return (
    <Result
      status="success"
      title="已成功补全信息！"
      subTitle="若想修改单位信息可以去个人中心进行修改."
      extra={[
        <Button type="primary" key="console" onClick={() => router.push('/home')}>
          去报名
        </Button>,
        <Button key="buy" onClick={() => router.push('/user/list')}>
          个人中心
        </Button>,
      ]}
    />
  );
}

const mapStateToProps = ({ user }: ConnectState) => {
  return { unitAccount: user.unitAccount };
};

export default connect(mapStateToProps)(CompleteResult);
