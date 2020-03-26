import React, { useEffect } from 'react';
import router from 'umi/router';
import { connect, Dispatch } from 'dva';
import { message } from 'antd';
import { ConnectState } from '@/models/connect';

interface AuthorizedProps {
  children: React.ReactNode;
  unitAccount?: number;
  dispatch: Dispatch;
}

function Authorized(props: AuthorizedProps) {
  const { unitAccount, dispatch } = props;

  useEffect(() => {
    if (unitAccount !== undefined && unitAccount === 0) {
      message.warning('请先补全信息');
      router.push({
        pathname: '/complete',
        query: {
          type: 0,
        },
      });
      dispatch({
        type: '/user/getAccountData',
      });
    }
  }, [unitAccount, dispatch]);

  return <>{props.children}</>;
}

export default connect(({ user }: ConnectState) => {
  return {
    unitAccount: user.unitAccount,
  };
})(Authorized);
