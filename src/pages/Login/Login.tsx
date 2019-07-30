import React from 'react';
import InitialForm,{ ItemProps, FormStyle } from '@/components/AntdForm/InitialForm.tsx';
import styles from './Login.css';
import { Card, Button, Icon,Tabs, Tag } from 'antd';
import router from 'umi/router';

const { TabPane } = Tabs;

let formStyle:FormStyle = {
  formLayout: 'vertical',
  formItemLayout: {
    wrapperCol: {},
    labelCol: {}
  }
};

let formItem:Array<ItemProps> = [
  {
    type: 'input', field: 'userid', rules: [{required: true, message: '请输入账号'}],label: '个人账号',
    placeholder: '请输入账号',
  },
  {
    type: 'input', field: 'password', rules: [{required: true, message: '请输入密码'}],label: '密码',
    placeholder: '请输入密码',
  }
];

let MobileFormStyle:FormStyle = {
  formLayout: 'vertical',
  formItemLayout: {
    wrapperCol: {span:24 },
    labelCol: {}
  }
}

let MobileFormItem:Array<ItemProps> = [
  {
    type: 'input', field: 'userPhone', rules: [{required: true, message: '请输入账号'}],label: '手机号',
    placeholder: `请输入手机号`,
  },
  {
    type: 'input', field: 'userVerification', rules: [{required: true, message: '请输入账号'}],label: '验证码',
    placeholder: '请输入验证码'
  }
]

export default class Login extends React.Component {
// Card tile可以换为ReactNode,Input可以考虑加前缀图标用prefix,这里margin_bottom修改不了width

  constructor(props:any){
    super(props);
    this.state = {  }
  }

  // 回到个人报名页面
  public change=()=> {
    console.log("切换到单位报名");
    router.push('/login/company')
  }

  // 获取验证码
  public Verification=() => {

  }

  // 个人报名表单提交
  public PersonHandle=() => {

  }

  // 单位报名表单提交
  public CompanyHandle=() => {

  }

  render(): React.ReactNode {
    return (
      <div className={styles.CardForm}>  
              
        <Card title="个人登陆" extra={<div><Tag color="magenta">单位登陆点击这里➡</Tag><Button onClick={this.change} type="primary" >单位登陆<Icon type="right"/></Button></div>} style={{width:"40%",height:"400px"}}  >
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span><Icon type="user"/>账号密码登陆</span>} key="1" >
              <InitialForm
                formItem={formItem}
                handler={this.PersonHandle}
                formStyle={formStyle}            
              />
              <Button type="primary" style={{marginLeft:"260px"}} onClick={this.PersonHandle} >登陆</Button>
            </TabPane>
            <TabPane tab={<span><Icon type="mobile"/>手机号登陆</span>} key="2"  >
              <InitialForm
                formItem={MobileFormItem}
                handler={null}
                formStyle={MobileFormStyle}            
              />
              <Button type="primary" style={{marginLeft:"220px"}} onClick={this.Verification} >获取验证码</Button>
            </TabPane>
          </Tabs>
        
        </Card>
      </div>

    );
  }
}
