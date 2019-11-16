import React, { useEffect } from 'react';
import { Result, Button, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectState } from '@/models/connect';
import { ContestantUnitData } from '@/models/enroll';
import { sendEmail } from '@/services/enroll';

function EnrollSuccess(props: { contestantUnitData: ContestantUnitData }) {

  useEffect(() => {
    if(props.contestantUnitData.id === undefined) {
      router.push('/enroll/showEnroll');
      message.warning('请先确认信息后再进入该页面');
    }
  },[]);

   function send_email(e: React.MouseEvent) {
    const { id } = props.contestantUnitData;
    if(id === undefined ) { return; }
     let res = sendEmail({
      contestant_id: id
    });
    if(res) {
      message.success('发送成功')
    }
  }

    return(
        <Result
            status="success"
            title="已成功报名！"
            subTitle="若需要修改信息，请再次进入赛事报名通道修改。若有其他问题请联系组委会，谢谢参与！若未收到报名信息邮件，可点击下方按钮重新发送。"
            extra={[
                <div key={"result"}>
                <Button type="primary" key="console" onClick={() => {router.push('/home')}} >回到主页</Button>
                  <br/>
                  <br/>
                  <Button type="link" onClick={send_email} >发送报名信息邮件</Button>
                </div>
            ]}
        />
    )
}

export default connect(({ enroll }: ConnectState) => {
  const { unit } = enroll;
  return {
    contestantUnitData: unit.contestantUnitData
  }
})(EnrollSuccess);
