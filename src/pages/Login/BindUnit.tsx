import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Button, Col, Row, Tabs, Input
} from 'antd';
import InitialForm,{ItemProps,FormStyle} from '@/components/AntdForm/InitialForm.tsx';
// @ts-ignore
import styles from '@/pages/Login/index.less';

const { TabPane } = Tabs;

// 自适应的姗格配置
const autoAdjust = {
  xs: { span: 20 },
  sm: { span: 18 },
  md: { span: 16 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 8 },
};
// 表单 样式
const formStyle:FormStyle = {
  formLayout: 'horizontal',
  formItemLayout:{
    labelCol:{
      md:{span:4},sm:{span:6},xs:{span:24}
    },
    wrapperCol:{
      md:{span:20},sm:{span:18},xs:{span:24}
    }
  }
};
// 表单Item
const newFormItem:Array<ItemProps> = [
  {type: 'input', field: 'unitName',label: '单位名称', rules:[{required:true}], margin_bottom:'-10px'},
  {type: 'input', field: 'password',label: '密码', rules:[{required:true}], margin_bottom:'-10px'},
  {type: 'input', field: 'confirmPassword',label: '确认密码', rules:[{required:true}], margin_bottom:'-10px'},
  {type: 'input', field: 'contact',label: '联系人', rules:[{required:true}], margin_bottom:'-10px'},
  {type: 'input', field: 'phoneNumber',label: '手机', rules:[{required:true}], margin_bottom:'-10px'},
  {type: 'input', field: 'email',label: '邮箱', rules:[{required:true}], margin_bottom:'-10px'},
  {
    type: 'custom', field: 'c',label: '邮箱', rules:[{required:true}], margin_bottom:'-10px',
    customDOM: (
      <Input addonAfter={<Button onClick={() => {console.log('a')}}>获取验证码</Button>} />
    )
  },
];


function BindUnit() {


  return (
    <div className={styles['bind-page']}>
      <Row justify='center' type='flex'>
        <Col {...autoAdjust}>
          <div className={styles['form-block']}>
            <Tabs >
              <TabPane tab='注册新单位' key='new'>
                <InitialForm
                  formItem={newFormItem}
                  formStyle={formStyle}
                  handler={null}
                />
                <Button style={{marginTop: '30px', float: 'right'}} type='primary'>注册新单位（协会/俱乐部），并绑定管理</Button>
              </TabPane>
              <TabPane tab='已有单位，马上绑定' key='bind'>
                <div className={styles['bind-block']}>
                  <Input placeholder='请填写用户名'/>
                  <Input placeholder='密码' type='password'/>
                  <Input />
                  <Button type='primary'>马上绑定，进入下一步</Button>
                </div>
              </TabPane>
            </Tabs>

          </div>
        </Col>
      </Row>
    </div>
  );
}

export default connect()(BindUnit);
