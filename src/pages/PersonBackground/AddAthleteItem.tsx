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

interface AddFormProps {
    form?: FormComponentProps;
    resetField?: boolean;
    name?: string;
    identifyID?: string;
    sex?: string;
    birthday?: moment.Moment;
    phone?: string;
    submit?: (values: any) => void;
    modifyComfirm?: boolean;
    tablekey?: string;
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

  
class AddForm extends React.Component<AddFormProps & FormComponentProps,any> {
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
                this.props.submit(values);
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
    componentDidUpdate = (nextProps: AddFormProps,nextState: any) => {
        return true
    }
    // 重置表单与设置表单，对应取消跟修改
    componentWillReceiveProps = (nextProps:AddFormProps) => {
        // 重置表单
        if(this.props.resetField){
            this.props.form.resetFields();
        }
    }

    componentWillMount() {
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isIDCard } = this.state; 
        const prefixSelector = getFieldDecorator('prefix', {
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
                    })(<Input addonBefore={prefixSelector} style={{width:"100%"}} />)}
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
        console.log(props);
        if (props.tablekey !== "") {
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
            }   
        }
    }
})(AddForm));

function AddAthleteItem(props:{modifyConfirm: boolean,test:string ,judge: boolean, unitID?: number, dispatch: any, closeModal?: Function}) {
    const [ reset,setReset ] = React.useState(false);
    const [ modify,setModify ] = React.useState(false);

    React.useEffect(() =>{
        setReset(props.judge);
    })

    React.useEffect(() => {
        setModify(props.modifyConfirm);
        // setKey(props.key);
    })

    function close() {
        props.closeModal();
    }

    function handleSubmit(values: any) {
        event.preventDefault();
        values.prefix = '大陆身份证';
        let citys:string = '';
        let myAddress:string = '';
        let myImage:File = null;
        if (values.residence) {
            citys = values.residence.city.join("");
            myAddress = values.residence.address
        }else {
            myAddress = null;
            citys = null;
        }
        let payload = {
            idcard: values.identifyID,
            name: values.name,
            idcardtype: values.prefix,
            sex: values.sex,
            birthday: values.birthday,
            phonenumber: values.phone,
            email: values.email,
            province: citys,
            address: myAddress,
            emergencycontactpeople: values.emergencyContact,
            emergencycontactpeoplephone: values.emergencyContactPhone,
            face: myImage,
            unitdata: props.unitID
        }
        let res = addplayer(payload);
        res.then((resp) => {
            if (resp && resp.data === "true") {
                message.success('注册成功');
                close();
                setReset(true);
            }else {
                console.log(resp);
            }
        })
    }

    return (
        <div className={styles['addAthlete-item']}>
            <AddAthleteForm tablekey={props.test} resetField={reset} modifyComfirm={modify} submit={handleSubmit} />
        </div>
    )
}

export default connect()(AddAthleteItem);
