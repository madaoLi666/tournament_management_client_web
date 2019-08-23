import React,{ Component } from 'react';
import { Form, Input, Select, Button, Upload, Icon, message } from 'antd'
import { FormComponentProps, FormProps, ValidateCallback } from 'antd/lib/form';
import { UploadProps, RcFile, UploadChangeParam } from 'antd/lib/upload';
import { checkPhoneNumber, checkEmail } from '@/utils/regulars';
// @ts-ignore
import styles from './index.less';

interface UnitInfo {
  // 单位id
  unitdata:number;
  // 赛事id
  matchdata:number;
  // 本场赛事单位id
  name:number;
  leader:string; leaderphonenumber:string;
  coachone?:string; coachonephonenumber?:string;
  coachtwo?:string; coachotwophonenumber?:string;
  dutybook: File
}

const { Option } = Select;

interface UnitInfoFormProps extends FormComponentProps{
  emitData:(data: object) => void
}

const UnitInfoFormStyle: FormProps = {
  layout: 'horizontal',
  labelCol: { xs: { span: 24 }, sm: { span: 4 }, md: { span: 4 }, lg: { span: 4 }, xl: { span: 4 }, xxl: { span: 4 } },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 20 },
    xl: { span: 20 },
    xxl: { span: 20 },
  },
  colon: true,
  labelAlign: 'right',
};

class UnitInfoForm extends Component<UnitInfoFormProps,any>{

  state = {
    guaranteePic: false
  };

  // 对 教练（选填项）电话号码判别
  checkOptionalPhone = (rule: any, value: any, callback: Function) => {
    if(value === '' || value === undefined){
      callback();
    }else{
      if(checkPhoneNumber.test(value)){
        callback();
      }else{
        callback('请输入正确的国内手机号码');
      }
    }
  };
  // 提交表单
  handleSubmit = (e: React.FormEvent): void => {
    const { guaranteePic } = this.state;
    // 阻止冒泡
    e.preventDefault();
    const { emitData } = this.props;
    this.props.form.validateFieldsAndScroll((err: ValidateCallback<any>, values: any) => {
      if (!err) {
        // 判断用户是否上传了承诺书图片
        if(guaranteePic){
          // 合并在此提交出 父组件 上一层
          let formRes = {guaranteePic: guaranteePic,...values};
          emitData(formRes);
        }else{
          message.error('请上传承诺书图片后再提交单位信息');
        }
      }
    });
  };

  // 上传调用函数
  handleUploadChange = (info: UploadChangeParam) => {
    const { file, fileList } = info;
    // 限制文件大小 为 2M
    if(file.size  / 1024 / 1024 > 2){
      message.error("文件大小超过2M，请重新上传");
      fileList.pop();
      return;
    }
    // 限制文件上传个数
    if(fileList.length > 1){
      message.error('仅能上传一个文件');
      fileList.pop();
      return;
    }
    this.setState({guaranteePic: file});
  };

  render(): React.ReactNode {
    const { getFieldDecorator } = this.props.form;

    const uploadProps:UploadProps = {
      accept: 'image/png,image/jpg',
      beforeUpload:() => (false),
      listType: 'picture',
      onChange:this.handleUploadChange
    };

    return (
      <Form
        {...UnitInfoFormStyle}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label='单位'>
          {getFieldDecorator('unitName',{})(<Input/>)}
        </Form.Item>
        <Form.Item label='参赛单位别名'>
          {getFieldDecorator('unitNameAlias',{})(<Input placeholder='可以使用别名参赛'/>)}
        </Form.Item>
        <Form.Item label='领队姓名'>
          {getFieldDecorator('leaderName',{
            rules: [{required: true, message: '请输入领队姓名'}]
          })(
            <Input placeholder='请输入领队姓名' />
          )}
        </Form.Item>
        <Form.Item label='联系电话'>
          {getFieldDecorator('leaderPhone',{
            rules: [{required: true, message: '请输入领队联系电话'},{ pattern: checkPhoneNumber, message: '请输入正确的国内手机号码'}]
          })(
            <Input placeholder='请输入领队联系电话'/>
            )}
        </Form.Item>
        <Form.Item label='领队邮箱'>
          {getFieldDecorator('leaderEmail',{
            rules: [{required: true, message: '请输入领队邮箱'},{ pattern: checkEmail, message: '请输入正确的电子邮箱地址'}]
          })(
            <Input placeholder='请输入邮箱' />
          )}
        </Form.Item>
        <Form.Item label='教练姓名'>
          {getFieldDecorator('coach1Name',{})(
            <Input placeholder='选填' />
          )}
        </Form.Item>
        <Form.Item label='联系电话'>
          {getFieldDecorator('coach1Phone',{
            rules: [{validator: this.checkOptionalPhone}]
          })(
            <Input placeholder='选填' />
          )}
        </Form.Item>
        <Form.Item label='教练姓名'>
          {getFieldDecorator('coach2Name',{})(
            <Input placeholder='选填' />
          )}
        </Form.Item>
        <Form.Item label='联系电话'>
          {getFieldDecorator('coach2Phone',{
            rules: [{validator: this.checkOptionalPhone}]
          })(
            <Input placeholder='选填' />
          )}
        </Form.Item>
        <Form.Item label='上传自愿责任书'>
          <Upload {...uploadProps} >
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          wrapperCol={{span: 24}}
          labelCol={{span: 0}}
          style={{textAlign: 'center'}}
        >
          <br/>
          <Button style={{width: '100%'}} type='primary' htmlType='submit' >确认信息，进入报名</Button>
        </Form.Item>
      </Form>
    )
  }
}

const UIForm = Form.create<UnitInfoFormProps>()(UnitInfoForm);

function EditUnitInfo(props:{}) {

  function submitData(data: object) {
    console.log(data);
  }

  return (
    <div className={styles['edit-unit-info']}>
      <UIForm
        emitData={submitData}
      />
    </div>
  )
}

export default EditUnitInfo;
