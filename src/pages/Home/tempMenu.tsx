import React from 'react';
import { Dispatch } from 'redux';
import { Result, Button } from 'antd';
import { router } from 'umi';

interface TempMenuProps {
  dispatch: Dispatch;
}

function TempMenu(props: TempMenuProps) {

  return (
    <Result
      status={"warning"}
      title={"此功能暂未开放，敬请等待"}
      extra={
        <Button type={"primary"} key={"console"} onClick={() => router.push('/home')} >返回主页</Button>
      }
      style={{marginTop: '10%'}}
    />
  )
}

export default TempMenu;
