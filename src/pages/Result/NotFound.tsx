import React from 'react';
import { Result, Button } from 'antd';
import router from 'umi/router';

export default function NotFound() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="抱歉,此页面未找到"
            extra={<Button type="primary" onClick={() => {router.goBack()}} >返回</Button>}
        />
    )
}
