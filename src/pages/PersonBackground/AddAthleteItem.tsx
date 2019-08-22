import * as React from 'react';
import {  Form, Button, Input, Row, Col, Select, DatePicker, message } from 'antd';
import AddressInput from '@/components/AddressInput/AddressInput.tsx';
import { FormComponentProps } from 'antd/lib/form';
// @ts-ignore
import styles from './index.less';
import { connect, DispatchProp } from 'dva';
import { checkIDCard } from '@/utils/regulars';
import { addplayer } from '@/services/athlete';
import moment from 'moment'
import PicturesWall from './pictureWall';
import { AthleteData } from '@/models/user';

// 表单State
interface State {
    isIDCard: boolean;
}

// 表单Props
interface AddFormProps {
    form?: FormComponentProps;
    // 重置表单boolean  传入true代表重置，重置方法在componentWillReceiveProps
    resetField?: boolean;
    // 表单提交方法,todo 来区别是注册还是修改
    submit: (values: any, todo: string) => void;
    // 表格的key
    tablekey?: string;

    modifyComfirm?: boolean;
}

// 表单的属性名
export interface formFields {
    image?: File | undefined | null
    name?: string
    identifyID?: string
    idCardType?: string
    sex?: string
    birthday?: string
    phone?: string | undefined | null
    email?: string | undefined | null
    residence?: {
        city: string[] | undefined | null,
        address: string | undefined | null
    }
    emergencyContact?: string | undefined | null
    emergencyContactPhone?: string | undefined | null
}

// 表单layout
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
      md: { span: 5 },
      lg: { span: 6 },
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
  
class AddForm extends React.Component<AddFormProps & FormComponentProps,State> {
    constructor(props: AddFormProps & FormComponentProps) {
        super(props);
        this.state = {
            isIDCard: true,
        };
    }
    // 提交表单
    public handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err: Error,values: any) => {
            if(!err) {
                // 如果没有表格的key，代表是从添加运动员按钮进来的
                if (this.props.tablekey === '') {
                    this.props.submit(values,'register');
                } else {
                    this.props.submit(values, 'update');
                }
            }
        })
    }

    // 处理填写身份证事件
    handleIDCardChange = (rule: any, value: any, callback: Function) => {
        const { isIDCard } = this.state;
        const { setFieldsValue } = this.props.form;
        // 证件类型为身份证
        if(!isIDCard || value === undefined){
            callback();
            return;
        }
        // 长度是否为18
        if(value !== undefined && value.length !== 18){
            callback("请输入正确的证件号");
            return;
        }
        if(checkIDCard.test(value) && isIDCard){
            const birthday = `${value.slice(6,10)}${value.slice(10,12)}${value.slice(12,14)}`;
            setFieldsValue({
                sex: value.slice(-2,-1)%2 === 1 ? '男' : '女',
                birthday: moment(birthday)
            });
            callback();
            return;
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

    // 重置表单与设置表单，对应取消跟修改
    componentWillReceiveProps = (nextProps:AddFormProps) => {
        // 重置表单
        if(this.props.resetField){
            this.props.form.resetFields();
        }
    }

    componentDidMount() {
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isIDCard } = this.state; 
        const prefixSelector = getFieldDecorator('idCardType', {
            initialValue: '大陆身份证',
            })(
            <Select 
                onChange={this.handlerCertificationTypeChange}
                style={{ width: 130 }}
            >
                <Select.Option value="identifyID" >大陆身份证</Select.Option>
                <Select.Option value="hkmt">港澳台回乡证</Select.Option>
                <Select.Option value="passport">护照</Select.Option>
            </Select>,
            );
        
        return (
            <Form layout="horizontal" {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item style={{marginLeft:"45%"}}>
                    {getFieldDecorator('image',{
                        initialValue:null
                    })(<PicturesWall />)}
                </Form.Item>
                <Form.Item label="姓名">
                    {getFieldDecorator('name',{
                        rules: [{required: true, message: '请输入姓名'}]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="证件号">
                    {getFieldDecorator('identifyID',{
                        rules: [{required: true, message: '请输入证件号！'},{validator: this.handleIDCardChange}],
                        trigger: 'onChange'
                    })(<Input disabled={this.props.tablekey === '' ? false : true} addonBefore={prefixSelector} style={{width:"100%"}} />)}
                </Form.Item>
                <Form.Item label="性别" >
                    <Row>
                        <Col span={9}>
                            {getFieldDecorator('sex', {
                                rules: [{ required: true, message: '请选择性别！' }],
                            })(
                                <Select placeholder="请选择性别" disabled={isIDCard}>
                                <Select.Option value="man">男</Select.Option>
                                <Select.Option value="woman">女</Select.Option>
                                </Select>
                            )}
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label="出生年月日">
                    {getFieldDecorator('birthday',{
                        rules: [{type: 'object', required: true, message: '请选择时间！'}]
                    })(<DatePicker placeholder="请选择出生年月日" disabled={isIDCard} />)}
                </Form.Item>
                <Form.Item label="联系电话">
                    {getFieldDecorator('phone',{
                        initialValue:null,
                        rules: [{pattern:/1[3578]\d{9}/, message:'请检查联系电话是否正确'}]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="邮箱">
                    {getFieldDecorator('email',{
                        initialValue:null,
                        rules: [{type: 'email', message: '请输入正确的邮箱格式'}]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label='地址'>
                    {getFieldDecorator('residence', {
                    })(
                    <AddressInput />,
                    )}
                </Form.Item>
                <Form.Item label="紧急联系人">
                    {getFieldDecorator('emergencyContact',{
                        initialValue:null,
                        rules: []
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="紧急联系人电话">
                    {getFieldDecorator('emergencyContactPhone',{
                        initialValue:null,
                        rules: [{pattern:/1[3578]\d{9}/, message:'请检查联系电话是否正确'}]
                    })(<Input />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button style={{width:"100%"}} type="primary" htmlType="submit">确定</Button>
                </Form.Item>
            </Form>
        )
    }
}

//setmodifyInfo(props.unitData[0].unitathlete[Number(tableKey)-1].athlete);
const formStateToProps = ({user}:any) => {
    return { user: user };
}

const AddAthleteForm = connect(formStateToProps)(Form.create<AddFormProps & FormComponentProps>({
    mapPropsToFields(props: any) {
        if (props.tablekey !== '') {
            // 生日，re是正则匹配，用于替换，处理数据库中的birth字符串
            let birth = props.user.unitathlete[Number(props.tablekey)-1].athlete.birthday as string;
            let re = /-/gi;

            return {
                name: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.name
                }),
                sex: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.sex
                }),
                emergencyContact: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.emergencycontactpeople
                }),
                emergencyContactPhone: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.emergencycontactpeoplephone
                }),
                email: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.email
                }),
                identifyID: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.idcard
                }),
                phone: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.phonenumber
                }),
                birthday: Form.createFormField({
                    value: moment(birth.substr(0,10).replace(re,''))
                })
            }
        }
    }
})(AddForm));

export default connect()(AddAthleteForm);
