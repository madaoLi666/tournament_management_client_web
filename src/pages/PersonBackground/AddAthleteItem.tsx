import * as React from 'react';
import Upload, { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { message, Icon, Modal, Button, Input, Row, Col, Select, DatePicker } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import Form, { FormComponentProps } from 'antd/lib/form';
// @ts-ignore
import styles from './index.less';
import { connect } from 'dva';

interface AddFormProps {
    form?: FormComponentProps;
}

// 表单layout
const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
      md: { span: 6 },
      lg: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 12 },
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
            disable: true
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

    render() {
        const { getFieldDecorator, resetFields } = this.props.form;
        const { Item } = Form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: 'identifyID',
            })(
            <Select 
                onChange={(value:string) => {
                    if(value==="identifyID"){resetFields(['sex']),this.setState({disable:true})}
                    else {
                        this.setState({disable:false})
                    }
                }}
                style={{ width: 70 }}
            >
                <Select.Option value="identifyID" >居民身份证</Select.Option>
                <Select.Option value="hkmt">港澳台回乡证</Select.Option>
                <Select.Option value="passport">护照</Select.Option>
            </Select>,
            );
        
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Item label="姓名">
                    {getFieldDecorator('name',{
                        rules: [{required: true, message: '请输入姓名'}]
                    })(<Input />)}
                </Item>
                <Item>
                    {getFieldDecorator('identifyID',{
                        rules: [{required: true, message: '请输入证件号！'}]
                    })(<Input addonBefore={prefixSelector} style={{width:"100%"}} />)}
                </Item>
                <Item label="性别" hasFeedback={true}>
                    {getFieldDecorator('sex', {
                        rules: [{ required: true, message: '请选择性别！' }],
                    })(
                        <Select placeholder="请选择性别" disabled={false}>
                        <Select.Option value="man">男</Select.Option>
                        <Select.Option value="woman">女</Select.Option>
                        </Select>
                    )}
                </Item>
                <Item label="出生年月">
                    {getFieldDecorator('date-picker',{
                        rules: [{type: 'object', required: true, message: '请选择时间！'}]
                    })(<DatePicker />)}
                </Item>
                
                <Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">注册绑定,并进入下一步操作</Button>
                </Item>
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
    // 添加运动员DOM TODO
    let addAthleteDOM:React.ReactNode = (
        <div className={styles['addAthlete-item']}>
            <Upload 
                onChange={handleChange}
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
            >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width:"100%"}} /> : uploadButton}
            </Upload>
            <AddAthleteForm />
        </div>
    )

    return (
        <div>
            {addAthleteDOM}
        </div>
    )
}

export default AddAthleteItem;
