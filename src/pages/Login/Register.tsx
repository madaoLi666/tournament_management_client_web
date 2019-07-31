import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import InitialForm,{ ItemProps, FormStyle } from '@/components/AntdForm/InitialForm.tsx';
import { Button } from 'antd';
import { Link } from 'umi'


let formStyle:FormStyle = {
    formLayout: 'vertical',
    formItemLayout: {
      wrapperCol: { span:24 },
      labelCol: {}
    }
  };

let formItem:Array<ItemProps> = [
{
    type: 'input', field: 'userPhone', rules: [{required: true, message: '请输入账号'}],label: '手机号',
    placeholder: '手机号'
},
{
    type: 'input', field: 'verificationWord', rules: [{required: true, message: '请输入密码'}],label: '验证码',
    placeholder: '请输入验证码',
}
];

class Register extends React.Component {
    constructor(props:any) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div className={styles['register-page']}>
              <p>注册</p>
              <div>
              <InitialForm
                formItem={formItem}
                handler={null}
                formStyle={formStyle}            
              />
              <Button className={styles['inline']} >获取验证码</Button>
              </div>
              <Button type="primary" style={{width:'60%',marginTop:'10%'}} >注册</Button>
              <Link to='/login' style={{marginLeft:'15%'}}>使用已有账号登陆</Link>
            </div>
        );
    }
}

export default Register;
