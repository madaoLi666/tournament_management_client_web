import * as React from 'react';
import {  Form, Button, Input, Row, Col, Select, DatePicker, message } from 'antd';
import AddressInput from '@/components/AddressInput/AddressInput.tsx';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { checkIDCard } from '@/utils/regulars';
import moment,{ Moment } from 'moment'
import PicturesWall from './pictureWall';
import { UploadFile } from 'antd/lib/upload/interface';
// @ts-ignore
import styles from './index.less';

// 表单State
interface State {
    isIDCard: boolean;
    file?: any;
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
    user?: any;
}

// 表单的属性名
export interface formFields {
    image?: UploadFile | undefined | null
    name?: string
    identifyID?: string
    idCardType?: string
    sex?: string
    birthday?: Moment
    phone?: string | undefined | null
    email?: string | undefined | null
    residence?: {
        city: string[] | undefined | null ,
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
            file:{},
        };
    }
    // 提交表单
    public handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err: Error,values: any) => {
            let isBirthdayValid = values.birthday as Moment;
            if(!err) {
                if(values.birthday === undefined || values.birthday === null) {
                    message.error('请确认出生年月日是否已填');
                    return;
                }
                if(!isBirthdayValid.isValid()) {
                    message.error('请确认身份证的出生日期是否正确!');
                    return;
                }
                if(this.state.file) {
                    values.image = this.state.file;
                }
                // 如果地址项什么都没有输入
                if(values.residence === undefined) {
                    ;
                }else {
                    if(values.residence.city === undefined && values.residence.address === null) {
                        values.residence.city = '';
                        values.residence.address = '';
                    } else if(values.residence.city === undefined && values.residence.address !== null) {
                        message.error('请检查地址项是否正确！');
                        return;
                    }else if(values.residence.city.length === 0 && values.residence.address !== (null || '')) {
                        message.error('请检查地址项是否正确！');
                        return;
                    }
                    else {
                        for(let i = 0; i < 3; i++) {
                            values.residence.city[i] += '-'
                        }
                    }
                }
                //如果没有表格的key，代表是从添加运动员按钮进来的
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
        callback('请输入正确的身份证号');
        return;
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

    componentDidUpdate(prevProps: Readonly<AddFormProps & FormComponentProps>, prevState: Readonly<any>, snapshot?: any) {
        const pC =  prevProps.resetField;
        const tC = this.props.resetField;
        if(!pC && tC ) {
            this.props.form.resetFields();
            this.setState({isIDCard:true});
            this.props.form.setFieldsValue({
                image: null
            })
        }
    }

    getFile = (file: UploadFile) => {
        this.setState({
            file: file.originFileObj
        })
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
                disabled={this.props.tablekey === '' ? false : true}
            >
                <Select.Option value="大陆身份证" >大陆身份证</Select.Option>
                <Select.Option value="港澳台回乡证">港澳台回乡证</Select.Option>
            </Select>,
            );

        return (
            <Form layout="horizontal" {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item style={{marginLeft:"45%"}}>
                    {getFieldDecorator('image',{
                    })(<PicturesWall getFile={this.getFile} />)}
                </Form.Item>
                <Form.Item label="姓名">
                    {getFieldDecorator('name',{
                        rules: [{required: true, message: '请输入姓名'}]
                    })(<Input placeholder="请输入运动员姓名"/>)}
                </Form.Item>
                <Form.Item label="证件号">
                    {getFieldDecorator('identifyID',{
                        rules: [{required: true, message: '请输入证件号！'},{validator: this.handleIDCardChange}],
                        trigger: 'onChange'
                    })(<Input  placeholder="请输入运动员证件号" disabled={this.props.tablekey === '' ? false : true} addonBefore={prefixSelector} style={{width:"100%"}} />)}
                </Form.Item>
                <Form.Item label="性别" >
                    <Row>
                        <Col span={9}>
                            {getFieldDecorator('sex', {
                                rules: [{ required: true, message: '请选择性别！' }],
                            })(
                                <Select placeholder="请选择性别" disabled={isIDCard}>
                                <Select.Option value="男">男</Select.Option>
                                <Select.Option value="女">女</Select.Option>
                                </Select>
                            )}
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label="出生年月日" className={styles['require']}>
                    {getFieldDecorator('birthday',{
                    })(<DatePicker placeholder="请选择出生年月日" disabled={isIDCard} />)}
                </Form.Item>
                <Form.Item label="联系电话">
                    {getFieldDecorator('phone',{
                        initialValue:'',
                        rules: [{pattern:/^1[3578]\d{9}$/, message:'请检查联系电话是否正确'}]
                    })(<Input placeholder="选填"/>)}
                </Form.Item>
                <Form.Item label="邮箱">
                    {getFieldDecorator('email',{
                        initialValue:'',
                        rules: [{type: 'email', message: '请输入正确的邮箱格式'}]
                    })(<Input  placeholder="选填"/>)}
                </Form.Item>
                <Form.Item label='地址'>
                    {getFieldDecorator('residence', {})(
                        <AddressInput />,
                    )}
                </Form.Item>
                <Form.Item label="紧急联系人">
                    {getFieldDecorator('emergencyContact',{
                        initialValue:'',
                        rules: []
                    })(<Input  placeholder="选填"/>)}
                </Form.Item>
                <Form.Item label="紧急联系人电话">
                    {getFieldDecorator('emergencyContactPhone',{
                        initialValue:'',
                        rules: [{pattern:/^1[3578]\d{9}$/, message:'请检查联系电话是否正确'}]
                    })(<Input placeholder="选填"/>)}
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
        if (props.tablekey !== '' && props.user.unitathlete !== undefined) {
            // 生日，re是正则匹配，用于替换，处理数据库中的birth字符串
            let birth = props.user.unitathlete[Number(props.tablekey)-1].athlete.birthday as string;
            let re = /-/gi;
            let city = props.user.unitathlete[Number(props.tablekey)-1].athlete.province as string;
            let citys:string[];
            if (city !== null) {
                citys = city.split('-',3);
            }
            let imageUrl = props.user.unitathlete[Number(props.tablekey)-1].athlete.face as string;

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
                }),
                residence: Form.createFormField({
                    value:{
                        address: props.user.unitathlete[Number(props.tablekey)-1].athlete.address,
                        city: citys
                    }
                }),
                image: Form.createFormField({
                    value:  imageUrl
                }),
                idCardType: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.idcardtype
                })
            }
        }else if(props.tablekey !== '') {
            // 生日，re是正则匹配，用于替换，处理数据库中的birth字符串
            let birth = props.user.athleteData[0].birthday as string;
            let re = /-/gi;
            let city = props.user.athleteData[0].province as string;
            let citys:string[];
            if (city !== null) {
                citys = city.split('-',3);
            }
            let imageUrl = props.user.athleteData[0].face as string;

            return {
                name: Form.createFormField({
                    value: props.user.athleteData[0].name
                }),
                sex: Form.createFormField({
                    value: props.user.athleteData[0].sex
                }),
                emergencyContact: Form.createFormField({
                    value: props.user.athleteData[0].emergencycontactpeople
                }),
                emergencyContactPhone: Form.createFormField({
                    value: props.user.athleteData[0].emergencycontactpeoplephone
                }),
                email: Form.createFormField({
                    value: props.user.athleteData[0].email
                }),
                identifyID: Form.createFormField({
                    value: props.user.athleteData[0].idcard
                }),
                phone: Form.createFormField({
                    value: props.user.athleteData[0].phonenumber
                }),
                birthday: Form.createFormField({
                    value: moment(birth.substr(0,10).replace(re,''))
                }),
                residence: Form.createFormField({
                    value:{
                        address: props.user.athleteData[0].address,
                        city: citys
                    }
                }),
                image: Form.createFormField({
                    value:  imageUrl
                }),
                idCardType: Form.createFormField({
                    value: props.user.unitathlete[Number(props.tablekey)-1].athlete.idcardtype
                })
            }
        }
    }
})(AddForm));

export default connect()(AddAthleteForm);
