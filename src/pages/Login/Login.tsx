import React from 'react';
import InitialForm,{ ItemProps, FormStyle } from '@/components/AntdForm/InitialForm.tsx';
import styles from './Login.css';


let formStyle:FormStyle = {
  formLayout: 'inline',
  formItemLayout: {
    wrapperCol: {},
    labelCol: {}
  }
};

let formItem:Array<ItemProps> = [
  {
    type: 'input', field: 'username', rules: [{required: true, message: '请输入账号'}],
    placeholder: '请输入账号',
    height: '40px',
    width: '100%',
    wrapperCol:{
      sm: {span: 24, offset: 0}
    }
  },
  {
    type: 'input', field: 'password', rules: [{required: true, message: '请输入密码'}],
    placeholder: '请输入密码',
    height: '40px',
    width: '100%',
    wrapperCol:{
      sm: {span: 24, offset: 0}
    }
  }
];

export default class Login extends React.Component {

  render(): React.ReactNode {
    return (
      <div>
        <p>Login.tsx</p>
        {/*InitialForm*/}
        <InitialForm
          formItem={formItem}
          handler={null}
          formStyle={formStyle}
        />
      </div>

    );
  }
}
