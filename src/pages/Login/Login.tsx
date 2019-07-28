import React from 'react';
import InitialForm,{ItemProps} from '@/components/AntdForm/InitialForm.tsx';

let formStyle = {   //formStyle
  formLayout: 'inline',
  formItemLayout: {
    wrapperCol: {},
    labelCol: {}
  }
};

let formItem = [    //field,wrapperCol,type
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

export default function Login(props: any) {

  const [state,setstate] = React.useState(props)


  function formDataSubmit () {}
  function formDataReset () {}

  function formDataHandler(submit: any, reset: any) {
    console.log("test")
  }

  return (
    <div>
      <InitialForm    //InitialForm
        formItem={formItem}
        handler={formDataHandler}
        formStyle={formStyle}
      />
    </div>
  
  );
}
