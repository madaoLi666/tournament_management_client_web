import  React, { useState} from 'react';
import { Form, Upload, Table, Input, Button, Modal, message, Select, DatePicker } from 'antd';
import moment from 'moment';
import { FaPlus } from 'react-icons/fa';
import AddressInput from '@/components/AddressInput/AddressInput';

import { UploadChangeParam } from 'antd/lib/upload';
import { FormComponentProps, FormProps, ValidateCallback } from 'antd/lib/form';
import { ModalProps } from 'antd/lib/modal';
import { ColumnProps } from 'antd/lib/table';

import { checkPhoneNumber, checkEmail, checkIDCard } from '@/utils/regulars';

// @ts-ignore
import styles from './index.less';
const { Option } = Select;
const { Item } = Form;
// 样式
const formStyle: FormProps = {
  layout: 'horizontal',
  labelCol: {span: 4},
  wrapperCol: {span: 20},
  colon: true,
  labelAlign: 'right'
};
//
interface AthleteInfoFormProps extends FormComponentProps{
  emitData:(data:object) => void
}

// 转base64
function getBase64 (file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class AthleteInfoForm extends React.Component<AthleteInfoFormProps, any> {

  constructor(props: AthleteInfoFormProps) {
    super(props);
    this.state = {
      // 拿到个人上传的照片后 需要 放入 fileList中即可以查看
      // {uid:-1,url: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
      fileList: [],
      previewImage: '',
      previewVisible: false,
      // 是否 选中使用身份证
      isIDCard:false
    }
  }

  /* =====================表单动态修改=========================== */

  // 处理填写身份证事件
  handleIDCardChange = (rule: any, value: any, callback: Function) => {
    const { isIDCard } = this.state;
    const { setFieldsValue } = this.props.form;
    // 证件类型为身份证
    if(!isIDCard || value === undefined){
      callback(); return;
    }
    // 长度是否为18
    if(value.length !== 18) {
      callback("请输入正确的大陆居民身份证"); return;
    }
    if(checkIDCard.test(value) && isIDCard){
      const birthday = `${value.slice(6,10)}${value.slice(10,12)}${value.slice(12,14)}`;
      setFieldsValue({
        sex: value.slice(-2,-1)%2 === 1 ? '男' : '女',
        birthday: moment(birthday)
      });
      callback(); return;
    }
  };
  // 判断当前证件类型是否为身份证
  handlerCertificationTypeChange = (value: string) => {
    const ID_CARD_TEST = '身份证';
    if(value === ID_CARD_TEST){
      this.setState({isIDCard:true});
    }else{
      this.setState({isIDCard:false});
    }
    this.props.form.resetFields(['certificationNumber', 'sex', 'certificationNumber']);
  };

  validateEmail = (rule: any, value: any, callback: Function) => {
    return (value === '' || checkEmail.test(value)) ? callback() : callback('请填写正确的邮箱地址');
  };

  validatePhoneNumber = (rule: any, value: any, callback: Function) => {
    return (value === '' || checkPhoneNumber.test(value)) ? callback() : callback('请填写正确的手机号码');
  };


  // 处理表单提交
  // 只会有一个文件
  handleSubmit = (e: React.FormEvent): void => {
    const { emitData } = this.props;
    const { fileList } = this.state;
    // 阻止冒泡
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: ValidateCallback<any>, values: any) => {
      if (!err) {
        // 检查是否进行了图片上传
        if(fileList.length !== 0) {
          emitData({
            image:fileList[0] ,...values
          });
        }else {
          message.error('请先进行图片上传');
        }
      }
    });
  };

  /* =====================上传图片预览=========================== */

  // 将file 转码后的url设置 进入state
  handlePreview = async (file: any) => {
    if(!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    //
    await console.log(file);
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  // 上传图片提交 保存在state的fileList中
  handleChange = (info: UploadChangeParam) => {
    const { file, fileList } = info;
    // 限制文件大小 为 2M
    if(file.size  / 1024 / 1024 > 2){
      message.error("文件大小超过2M，请重新上传");
      fileList.pop();
      return;
    }
    this.setState({ fileList })
  };

  render(): React.ReactNode {
    const { getFieldDecorator } = this.props.form;
    const { fileList, previewImage, previewVisible, isIDCard } = this.state;
    // 最大上传限制
    const maxUploadNumberLimitation = 1;
    // upload样式
    const uploadBtn: React.ReactNode = (
      <div className={styles['p-upload-block']} style={{width: '100px', height: '100px'}}>
        <div>
          <p><FaPlus/></p>
          <p>点击上传图片</p>
        </div>
      </div>
    );
    return (
      <div>
        <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({previewVisible: false})}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Form
          {...formStyle}
          onSubmit={this.handleSubmit}
        >
          <Item style={{textAlign: 'center'}}>
            <Upload
              fileList={fileList}
              listType="picture-card"
              beforeUpload={() => false}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >

              {(fileList.length > maxUploadNumberLimitation-1) ? null : uploadBtn}
            </Upload>
          </Item>
          <Item label='姓名'>
            {getFieldDecorator('name',{
              rules:[{required:true, message: '请输入真实姓名'}]
            })(
              <Input placeholder='请输入真实姓名' autoComplete='off' />
            )}
          </Item>
          <Item label='证件类型'>
            {getFieldDecorator('idCardType',{
              rules: [{required:true,message:'请选择你的证件号码类型'}],
            })(
              <Select placeholder='请选择证件类型' onChange={this.handlerCertificationTypeChange}>
                <Option value='身份证'>身份证</Option>
                <Option value='港澳通行证'>港澳通行证</Option>
              </Select>
            )}
          </Item>
          <Item label='证件号码'>
            {getFieldDecorator('identifyNumber',{
              rules:[{required:true, message: '请填写证件号码'},{validator: this.handleIDCardChange}],
            })(
              <Input placeholder='请填写证件号码' autoComplete='off'/>
            )}
          </Item>
          <Item label='性别'>
            {getFieldDecorator('sex',{
              rules: [{required:true,message:'请选择你的性别'}],
            })(
              <Select disabled={isIDCard}>
                <Option value='男'>男</Option>
                <Option value='女'>女</Option>
              </Select>
            )}
          </Item>
          <Item label='出生年月日'>
            {getFieldDecorator('birthday',{
              rules: [{required:true,message:'请输入你的姓名'}],
            })(
              <DatePicker
                style={{width: '100%'}}
                disabled={isIDCard}
              />
            )}
          </Item>
          <Item label='联系电话'>
            {getFieldDecorator('phone',{
              rules: [{validator: this.validatePhoneNumber}]
            })(
              <Input/>
            )}
          </Item>
          <Item label='邮箱'>
            {getFieldDecorator('email',{
              rules: [{validator: this.validateEmail}]
            })(
              <Input/>
            )}
          </Item>
          <Item label='地址'>
            {getFieldDecorator('residence',{})(
              <AddressInput/>
            )}
          </Item>
          <Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              注册
            </Button>
          </Item>
        </Form>
      </div>
    );
  }
}

const AIForm = Form.create<AthleteInfoFormProps>()(AthleteInfoForm);

function ParticipantsAthleteList() {

  const [visible, setVisible] = useState(false);

  const modalProps: ModalProps = {
    title: '新建/修改赛事',
    visible: visible,
    width: '80%',
    maskClosable: false,
    style: { top: 0 },
    footer: null,
    onCancel: () => setVisible(false)
  };

  function submitNewAthleteData(data: object) {
    console.log(data);
  }

  return (
    <div className={styles['participants-athlete-list']}>
      <Button onClick={() => {setVisible(true)}}>open</Button>
      <Modal {...modalProps}>
        <AIForm
          emitData={submitNewAthleteData}
        />
      </Modal>
    </div>
  );
}

export default ParticipantsAthleteList;
