import React,{ useState,useEffect } from 'react';
// @ts-ignore
import styles from './index.less';
import InitialForm,{ItemProps} from '@/components/AntdForm/InitialForm.tsx';
import { Row, Col, Card, Tabs, Form, Input, Button } from 'antd';

// 标签页
const { TabPane } = Tabs;

// Col 自适应
const autoAdjust = {
  xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
};

// 已有账号登陆表单layout
const oldFormLayout = {
  labelCol: { span:4 },
  wrapperCol: { span:17 }
}

let formStyle = {
  formLayout: 'horizontal',
  formItemLayout: {
    wrapperCol: { span: 17 },
    labelCol: {}
  }
}

let formItem = [
  { label:'手机',type:'input',field:'userPhone', rules:[{required:true, message: '请输入手机号'}], placeholder: '手机号',
    height:'30px'
  },
  { label:'验证码',type:'input',field:'userPhone', rules:[{required:true, message: '请输入验证码'}], placeholder: '验证码',
  height:'30px'
  },
  { label:'邮箱',type:'input',field:'userPhone', rules:[{required:true, message: '请输入邮箱'}], placeholder: '邮箱',
    height:'30px'
  },
  { label:'验证码',type:'input',field:'userPhone', rules:[{required:true, message: '请输入验证码'}], placeholder: '验证码',
    height:'30px'
  },
  { label:'用户名',type:'input',field:'userPhone', rules:[{required:true, message: '请输入用户名'}], placeholder: '用户名',
    height:'30px'
  },
  { label:'登陆密码',type:'input',field:'userPhone', rules:[{required:true, message: '请输入登陆密码'}],
    height:'30px'
  },
  { label:'确认密码',type:'input',field:'userPhone', rules:[{required:true, message: '请输入确认密码'}],
    height:'30px'
  }
]


function Register(): React.ReactNode {
  // 标签页state,默认第一页
  const [tabsState,settabsState] = useState("1");

  // 标签页tab文字DOM
  let TabsTitle1:React.ReactNode = (
    <strong>第一次登陆，注册新账号</strong>
  )
  let TabsTitle2:React.ReactNode = (
    <strong>已有账号，马上绑定</strong>
  )

  // 提交表单  
  function handleSubmit(event:any) {
    event.preventDefault();
    console.log(event.target.value);
  }

  // FormDOM TODO 表单验证
  let FormDOM:React.ReactNode = (
    <Form onSubmit={handleSubmit} layout="horizontal" className={styles['register-form']} >
      <Form.Item label="用户名" {...oldFormLayout}>
        <Input />
      </Form.Item>
      <Form.Item label="密码" {...oldFormLayout} >
        <Input.Password/>
      </Form.Item>
      <Form.Item label="验证码" {...oldFormLayout}>
        <Input style={{width:'60%',marginRight:'40%'}} />
      </Form.Item>
      <Button type="primary" style={{width:'80%',marginRight:'10%'}} >马上绑定，进入下一步</Button>
    </Form>
  )

  // 标签页DOM
  let TabsDOM:React.ReactNode = (
    <Tabs defaultActiveKey={tabsState} >
      <TabPane tab={TabsTitle1} key="1">
        <InitialForm
          formItem={formItem}
          handler={null}
          formStyle={formStyle}
        />
      </TabPane>
      <TabPane tab={TabsTitle2} key="2">
        {FormDOM}
      </TabPane>
    </Tabs>
  )


  return (
    <div className={styles['register-page']}>
      <Row justify="center" type="flex">
        <Col {...autoAdjust}>
          <div className={styles['register-block']}>
            <Card 
              style={{width: '100%',height: '150%', borderRadius: '5px', boxShadow: '1px 1px 5px #111'}}
              headStyle={{color: '#2a8ff7'}}
            >
              {TabsDOM}
            </Card>
          </div>
        </Col>
      </Row>      
    </div>
  )

}

export default Register;
