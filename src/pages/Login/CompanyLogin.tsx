import * as React from 'react';
// @ts-ignore
import styles from '@/pages/Login/index.less';
import { Card, Button, Icon, Tag, Input } from 'antd';
import InitialForm,{ ItemProps, FormStyle } from '@/components/AntdForm/InitialForm.tsx';
import router from 'umi/router';


let formStyle:FormStyle = {
    formLayout: 'vertical',
    formItemLayout: {
      wrapperCol: {},
      labelCol: {}
    }
  };
  
  let formItem:Array<ItemProps> = [
    {
      type: 'input', field: 'companyID', rules: [{required: true, message: '请输入单位账号'}],label: '单位账号',
      placeholder: '请输入单位账号',
    },
    {
      type: 'input', field: 'companyPassword', rules: [{required: true, message: '请输入密码'}],label: '密码',
      placeholder: '请输入密码',
    }
  ];
  

export default class CompanyLogin extends React.Component {

    constructor(props:any) {
        super(props);
    }

    public change=()=> {
        console.log("切换到单位报名");
        router.push('/login')
    }

    // 表单提交
    public Handle=() => {

    }

    render(): React.ReactNode {
        return (
            <div className={styles.CardForm}>
            <Card title="单位登陆" extra={<div><Tag color="magenta">个人登陆点击这里➡</Tag><Button onClick={this.change} type="primary" ><Icon type="left"/>个人登陆</Button></div>} style={{width:"40%",height:"400px"}}  >
              <InitialForm
                formItem={formItem}
                handler={null}
                formStyle={formStyle}            
              />
              <Button type="primary" style={{marginLeft:"260px"}} onClick={this.Handle} >登陆</Button>
            </Card>
            
          </div>
        )
    }


}
