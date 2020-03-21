import React, { useEffect } from 'react';
import router from 'umi/router';
import { connect, Dispatch } from 'dva';
import { message } from 'antd';

interface AuthorizedProps {
  children: React.ReactNode;
}

function Authorized(props: AuthorizedProps) {
  useEffect(() => {
    const localToken = window.localStorage.getItem('TOKEN');

    // 检查本地是否存在token
    if (localToken === undefined || localToken === null) {
      message.warn('请先进行登录');
      router.push('/login');
    }
  });

  return <>{props.children}</>;
}

export default connect(() => {
  return {};
})(Authorized);
