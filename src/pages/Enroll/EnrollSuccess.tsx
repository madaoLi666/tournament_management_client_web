import React from 'react';
import { Result, Button } from 'antd';
import router from 'umi/router';

function EnrollSuccess() {

    return(
        <Result
            status="success"
            title="已成功报名！"
            subTitle="若需要修改信息，请再次进入赛事报名通道修改。若有其他问题请联系组委会，谢谢参与！"
            extra={[
                <Button type="primary" key="console" onClick={() => {router.push('/home')}} >回到主页</Button>
            ]}
        />
    )
}

export default EnrollSuccess;
