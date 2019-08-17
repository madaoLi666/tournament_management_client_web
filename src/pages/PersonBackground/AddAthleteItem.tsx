import * as React from 'react';
import Upload, { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { message, Icon, Modal, Button, Input, Row, Col, Select, DatePicker } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import AddressInput from '@/components/AddressInput/AddressInput.tsx';
import Form, { FormComponentProps } from 'antd/lib/form';
// @ts-ignore
import styles from './index.less';
import { connect } from 'dva';
import { checkIDCard } from '@/utils/regulars';
import moment from 'moment'

interface AddFormProps {
    form?: FormComponentProps;
}

// 表单layout
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      md: { span: 6 },
      lg: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
      md: { span: 16 },
      lg: { span: 14 },
    },
  };
// 最后提交按钮的layout
const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 1,
      },
      md: { span: 15, offset: 4 },
      lg: { span: 16, offset: 4 },
    },
  };

  
class AddForm extends React.Component<AddFormProps & FormComponentProps,any> {
    constructor(props: AddFormProps & FormComponentProps) {
        super(props);
        this.state = {
            isIDCard: true
        };
    }
    // 提交表单
    public handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err: Error,values: any) => {
            if(!err) {
                console.log(values);
            }
        })
    }

  // 处理填写身份证事件
  handleIDCardChange = (rule: any, value: any, callback: Function) => {
        const { isIDCard } = this.state;
        const { setFieldsValue } = this.props.form;
        // 证件类型为身份证
        if(!isIDCard){
            callback();
        }
        // 长度是否为18
        if(value.length !== 18){
            callback();
        }
        if(checkIDCard.test(value) && isIDCard){
        const birthday = `${value.slice(6,10)}${value.slice(10,12)}${value.slice(12,14)}`;
        setFieldsValue({
            sex: value.slice(-2,-1)%2 === 1 ? '男' : '女',
            birthday: moment(birthday)
        });
        callback();
        }
    };
    // 判断当前证件类型是否为身份证
    handlerCertificationTypeChange = (value: string) => {
        const ID_CARD_TEST = 'identifyID';
        if(value === ID_CARD_TEST){
        this.setState({isIDCard:true});
        }else{
        this.setState({isIDCard:false});
        }
        this.props.form.resetFields(['identifyID', 'sex', 'birthday']);
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isIDCard } = this.state;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: 'identifyID',
            })(
            <Select 
                onChange={this.handlerCertificationTypeChange}
                style={{ width: 130 }}
            >
                <Select.Option value="identifyID" >居民身份证</Select.Option>
                <Select.Option value="hkmt">港澳台回乡证</Select.Option>
                <Select.Option value="passport">护照</Select.Option>
            </Select>,
            );
        
        return (
            <Form layout="horizontal" {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="姓名">
                    {getFieldDecorator('name',{
                        rules: [{required: true, message: '请输入姓名'}]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="证件号">
                    {getFieldDecorator('identifyID',{
                        rules: [{required: true, message: '请输入证件号！'},{validator: this.handleIDCardChange, message: '请填写正确的证件号'}],
                        trigger: 'onChange'
                    })(<Input addonBefore={prefixSelector} style={{width:"100%"}} />)}
                </Form.Item>
                <Form.Item label="性别" hasFeedback={true}>
                    {getFieldDecorator('sex', {
                        rules: [{ required: true, message: '请选择性别！' }],
                    })(
                        <Select placeholder="请选择性别" disabled={isIDCard}>
                        <Select.Option value="man">男</Select.Option>
                        <Select.Option value="woman">女</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="出生年月">
                    {getFieldDecorator('birthday',{
                        rules: [{type: 'object', required: true, message: '请选择时间！'}]
                    })(<DatePicker disabled={isIDCard} />)}
                </Form.Item>
                <Form.Item label="联系电话">
                    {getFieldDecorator('phone',{
                        rules: [{required: true, message: '请输入联系电话！'},{pattern:/1[3578]\d{9}/, message:'请检查联系电话是否正确'}]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="邮箱">
                    {getFieldDecorator('email',{
                        rules: [{required: true, message: '请输入邮箱'},{type: 'email', message: '请输入正确的邮箱格式'}]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label='地址'>
                    {getFieldDecorator('residence', {
                    rules:[{required:true, message:'请输入你的地址信息'}]
                    })(
                    <AddressInput/>,
                    )}
                </Form.Item>
                <Form.Item label="紧急联系人">
                    {getFieldDecorator('emergencyContact',{
                        rules: [{required: true, message: '请输入紧急联系人姓名'}]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="紧急联系人电话">
                    {getFieldDecorator('emergencyContactPhone',{
                        rules: [{required: true, message: '请输入紧急联系人联系电话！'},{pattern:/1[3578]\d{9}/, message:'请检查联系电话是否正确'}]
                    })(<Input />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">确定</Button>
                </Form.Item>
            </Form>
        )
    }
}


const AddAthleteForm = connect()(Form.create<AddFormProps & FormComponentProps>({
    name:'addAthlete'
})(AddForm));

function AddAthleteItem() {

    function getBase64(img: any,callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load',() => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file: RcFile, FileList: RcFile[]) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const [ loading,setLoading ] = React.useState(false);
    const [ imageUrl,setimageUrl ] = React.useState('');
    let handleChange = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl:any) => {
                setimageUrl(imageUrl);
                setLoading(false);
            })
        }
    }

    const uploadButton = (
        <div>
            <span>大头照</span>
            <Icon type={loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text" >添加图片</div>
        </div>
    )

    return (
        <div className={styles['addAthlete-item']}>
            <Upload 
                onChange={handleChange}
                name="avatar"
                listType="picture-card"
                className={styles['avatar-uploader']}
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
            >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width:"100%"}} /> : uploadButton}
            </Upload>
            <AddAthleteForm />
        </div>
    )
}

export default AddAthleteItem;
