import React, { useEffect } from 'react';
import router from 'umi/router';
import { connect, Dispatch } from 'dva';
import { message } from 'antd';

interface AuthorizedProps {
  dispatch: Dispatch;
  children: React.ReactNode;
}

function Authorized(props: AuthorizedProps) {
  useEffect(() => {
    const { dispatch } = props;
    const localToken = window.localStorage.getItem('TOKEN');

    // 检查本地是否存在token
    if (localToken === undefined || localToken === null) {
      message.warn('请先进行登录');
      router.push('/login');
    }
    // TODO 应该在这里发起一次请求，如果是401的话，就应该去登录
  });

  return <>{props.children}</>;
}

export default connect(() => {
  return {};
})(Authorized);
