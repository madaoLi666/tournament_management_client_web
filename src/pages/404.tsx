import React from 'react';
import { Result, Button } from 'antd';
import { router } from 'umi';

export default () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="功能开发中，敬请期待."
      extra={
        <Button
          type="primary"
          onClick={() => {
            router.push('/home');
          }}
        >
          回到主页
        </Button>
      }
    />
  );
};
