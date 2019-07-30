import React from 'react';
import InitialForm,{ ItemProps, FormStyle } from '@/components/AntdForm/InitialForm.tsx';


let formStyle:FormStyle = {
  formLayout: 'vertical',
  formItemLayout: {
    wrapperCol: {},
    labelCol: {}
  }
};

let formItem:Array<ItemProps> = [
  {
    type: 'input', field: 'username', rules: [{required: true, message: '请输入账号'}],label: 'username',
    placeholder: '请输入账号',
    height: '40px'
  },
  {
    type: 'input', field: 'password', rules: [{required: true, message: '请输入密码'}],label: 'password',
    placeholder: '请输入密码',
    height: '40px',
    width: '400px'
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
