import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { Button, Form, Input, message, PageHeader, Upload } from 'antd';
// @ts-ignore
import styles from './index.less';
import {  UploadChangeParam } from 'antd/lib/upload/interface';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { newUnitAccount } from '@/services/register';

const FormItem = Form.Item;

/********************************上传组件*****************************/
interface AvatarViewProps {
  avatar: string;
  getFile: Function;
}

function AvatarView(props:AvatarViewProps) {

  const [ legal, setLegal ] = useState(true);
  const isLegal = useRef(true);
  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只可以上传JPG/PNG文件!');
      setLegal(false);
      isLegal.current = false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小要小于2MB!');
      setLegal(false);
      isLegal.current = false;
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = ({ file,fileList }:UploadChangeParam) => {
    props.getFile(file,isLegal);
    isLegal.current = true;
  };

  return (
    <Fragment>
    <div>
      {/*<div className={styles.avatar_title}>*/}
      {/*  营业执照*/}
      {/*</div>*/}
      <div className={styles.avatar}>
        <img src={props.avatar} alt="avatar" />
      </div>
    </div>
    <Upload
      fileList={[]}
      onChange={handleChange}
      beforeUpload={beforeUpload}
    >
      <div className={styles.button_view}>
        <Button icon="upload">
          上传营业执照
        </Button>
      </div>
    </Upload>
  </Fragment>
  )
}

/********************************上传组件*****************************/

/* 营业执照管理的表单 */
interface MainPartProps extends FormComponentProps {
  dispatch?: Dispatch;
  current_main_part?: string;
}

function MainPart(props: MainPartProps) {
  let view: HTMLDivElement | undefined = undefined;
  function getViewDom(ref: HTMLDivElement) {
    view = ref;
  }
  const {
    form: { getFieldDecorator },
  } = props;
  const fileRef = useRef<any>('');

  function getAvatarURL() {
    const { current_main_part } = props;
    // if (currentUser) {
    //   if (currentUser.avatar) {
    //     return currentUser.avatar;
    //   }
    //   const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    //   return url;
    // }s
    return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
  }

  function handleSubmitMainPart(event: React.MouseEvent) {
    event.preventDefault();
    const { form } = props;
    form.validateFields((err: Error, values: any) => {
        message.success('submit');
        console.log(values);
    })
  }

  function getFile(file: any, legal: { current: boolean }) {
    if(!legal.current) { return; }
    message.success('已成功上传营业执照，请输入主体名称后点击更改营业执照信息');
  }

  return (
    <div className={styles.baseView} ref={getViewDom} >
    <div className={styles.right}>
      <PageHeader style={{fontSize:16, padding: 0}} title="营业执照管理" />
      <br/>
      <AvatarView getFile={getFile} avatar={getAvatarURL()} />
      <Form layout="vertical" hideRequiredMark>
        <FormItem label="主体名称" className={styles.input_view}>
          {getFieldDecorator('mainpart', {
            rules: [{ required: true , message: '请输入主体名称'}]
          })(<Input />)}
        </FormItem>
        <p>更改营业执照信息功能正在维护中，请稍后再进行上传</p>
        <Button type="primary" disabled htmlType={"submit"} onClick={handleSubmitMainPart} >
          更改营业执照信息
        </Button>
      </Form>
    </div>
  </div>
  )
}

const MainPartForm = Form.create<MainPartProps>()(MainPart);

/* 单位名称 单位联系人	单位联系人电话 邮箱 邮政编码 省份 地址 */
interface CurrentAccount {
  unitdata_id: number;
  name: string;
  contactperson: string;
  contactphone: string;
  email: string;
  postalcode: string;
  province: string;
  address: string;
  residence?: {
    city: Array<string>;
    address: string;
  };
}

interface AccountManagementProps extends FormComponentProps {
  dispatch: Dispatch;
  currentAccount: CurrentAccount;
  unitdata_id: number;
}

function AccountManagement(props: AccountManagementProps) {
    const [validStatus, setValidStatus] = useState<"" | "error" | "success" | "warning" | "validating">('success');
    let view: HTMLDivElement | undefined = undefined;
    function getViewDom(ref: HTMLDivElement) {
      view = ref;
    }
    const {
      form: { getFieldDecorator },
    } = props;

    function handleSubmit(event: React.MouseEvent) {
      event.preventDefault();
      const { form } = props;
      form.validateFieldsAndScroll((err: any, values: CurrentAccount) => {
        if(!err) {
          let temp: CurrentAccount = {unitdata_id: props.unitdata_id,
          email:values.email, contactperson: values.contactperson,contactphone: values.contactphone,
          postalcode: values.postalcode, name: values.name, province: values.province, address: values.address};
          props.dispatch({
            type: 'user/changeUnitBasicData',
            payload: temp
          })
        }
      })
    }

    async function checkUnitName(unitName:string): Promise<{data:string,error:string,notice:string}> {
      return await newUnitAccount({name:unitName})
    }

    function checkUnitNameIsLegal(rule: any, value: any, callback: Function){
      if(value === props.currentAccount.name) {
        setValidStatus('success');
        callback();
        return;
      }
      const setSuccess = () => {
        setValidStatus('success');
      };
      const setError = () => {
        setValidStatus('error');
      };
      if (value === "" || value === null || value === undefined) {
        callback();
        setValidStatus('error');
        return;
      }
      let res = checkUnitName(value);
      res.then(function (result:{data:string,error:string,notice:string}) {
        if (result) {
          callback();
          setSuccess();
          return;
        } else {
          callback('已有相同的单位名称');
          setError();
          return;
        }
      });
    };

    return (
      <div className={styles.baseView} ref={getViewDom} >
        <div className={styles.left}>
          <PageHeader className={styles.headerPage} style={{fontSize:16, padding: 0}} title="单位信息管理" />
          <br/>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="单位名称" hasFeedback validateStatus={validStatus}>
              {getFieldDecorator('name', {
                rules: [{ required: true , message: '请输入单位名称'},
                { validator: checkUnitNameIsLegal }]
              })(<Input />)}
            </FormItem>
            <FormItem label="单位联系人">
              {getFieldDecorator('contactperson', {
                rules: [{ required: true , message: '请输入单位联系人'}]
              })(<Input />)}
            </FormItem>
            <FormItem label="单位联系人电话">
              {getFieldDecorator('contactphone', {
                rules: [{pattern:/^1[35789]\d{9}$/, message:'请检查单位联系人电话是否正确'},
                  { required: true, message: '请输入单位联系人电话' }]
              })(<Input />)}
            </FormItem>
            <FormItem label="邮箱" >
              {getFieldDecorator('email', {
                rules: [ { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="邮政编码" >
              {getFieldDecorator('postalcode', {
                rules: [ { required: true, message: '请输入邮政编码' } ]
              })(<Input />)}
            </FormItem>
            <FormItem label='省份'>
              {getFieldDecorator('province', {
                rules: [ { required: true, message: '请输入单位所在省份' } ]
              })(<Input />)}
            </FormItem>
            <FormItem label='地址'>
              {getFieldDecorator('address', {
                rules: [ { required: true, message: '请输入具体地址' } ]
              })(<Input />)}
            </FormItem>
            <Button type="primary" htmlType={"submit"} onClick={handleSubmit} >
              更改单位信息
            </Button>
          </Form>
        </div>
        {/* <MainPartForm /> */}
      </div>
    );
}

const MapStateToProps = ({ user }: ConnectState) => {
  const { unitData } = user;
  if(unitData.length !==0 && unitData[0].id !== undefined ) {
    return {
      currentAccount: {
        unitdata_id: unitData[0].id,
        name: unitData[0].name,
        contactperson: unitData[0].contactperson,
        contactphone: unitData[0].contactphone,
        email: unitData[0].email,
        postalcode: unitData[0].postalcode,
        province: unitData[0].province,
        address: unitData[0].address
      },
      unitdata_id: unitData[0].id
    }
  }
  return user;
};

export default connect(MapStateToProps)(Form.create<AccountManagementProps & FormComponentProps >({
  mapPropsToFields(props: AccountManagementProps) {
    if(props.currentAccount !== undefined) {
      return {
        name: Form.createFormField({
          value: props.currentAccount.name
        }),
        contactperson: Form.createFormField({
          value: props.currentAccount.contactperson
        }),
        contactphone: Form.createFormField({
          value: props.currentAccount.contactphone
        }),
        email: Form.createFormField({
          value: props.currentAccount.email
        }),
        postalcode: Form.createFormField({
          value: props.currentAccount.postalcode
        }),
        province: Form.createFormField({
          value: props.currentAccount.province
        }),
        address: Form.createFormField({
          value: props.currentAccount.address
        })
      }
    }
  }
})(AccountManagement));