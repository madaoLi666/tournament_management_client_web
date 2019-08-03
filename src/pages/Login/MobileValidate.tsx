import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import { Form, Row, Col, Button, Input, Card, Tabs } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const { TabPane } = Tabs;

interface MobileFormProps {
    form?:FormComponentProps;
    isMobileLogin:boolean;
}

// 表单layout
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
      md: { span: 6 },
      lg: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 10 },
      sm: { span: 15 },
      md: { span: 16 },
      lg: { span: 16 }
    },
  };
  // 最后按钮的layout
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
        span: 24,
        offset: 0,
        },
        sm: {
        span: 10,
        offset: 8,
        },
        md:{ span: 15,offset:4 },
        lg:{ span: 16,offset:5 }
    },
};

// Col 自适应
const autoAdjust = {
    xs: { span: 20 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 8 }, xl: { span: 8 }, xxl: { span: 8 },
  };

class MobileValidateForm extends React.Component<MobileFormProps & FormComponentProps,any> {
    constructor(props:MobileFormProps & FormComponentProps) {
        super(props);
        this.state = {  };
    }

    // 提交表单  
    public handleSubmit=(event:any) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err:any,values:any) => {
        if (!err) {
            console.log('Received values of form :',values);
        }
        })
    }

    
    render() {

        const { getFieldDecorator } = this.props.form;
        let isMobileLogin = this.props.isMobileLogin;

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} >
                <Form.Item label='手机'>
                    <Row >
                        <Col span={15}>
                            {getFieldDecorator('mobileNumber',{
                                rules:[{required: true, message: '请输入手机！'}]
                            })(<Input />)}
                        </Col>
                        {/* 判断是否用手机登陆 */}
                        {isMobileLogin === false ?
                        <Col span={4}>
                            <Button  type="primary" >发送验证码</Button>
                        </Col>
                        :
                        <Col span={4}>
                            <Button disabled={true}  type="primary" >发送验证码</Button>
                        </Col>
                        }
                    </Row>
                </Form.Item>
                {isMobileLogin === false ?
                <Form.Item label='验证码'>
                    {getFieldDecorator('verificationCode',{
                        rules:[{required: true, message: '请输入验证码'}]
                    })(<Input />)}
                </Form.Item>
                :    
                <Form.Item label='验证码'>
                    <Input disabled={true} placeholder='您已用手机登陆，不需要再次验证' />
                </Form.Item>
                }
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" style={{width:'100%'}} htmlType="submit" >下一步</Button>
                </Form.Item>  
            </Form>
        );
    }
}

const MobileForm = Form.create<MobileFormProps & FormComponentProps>({
    name:'mobileForm'
})(MobileValidateForm);


export default function MobileValidate(props:boolean) {
    // props暂定为Boolean判断是否为手机验证登陆
    const [isMobileLogin,setIsMobileLogin] = React.useState(props);

    

    // 标签页DOM
    let TabsDOM:React.ReactNode = (
      <Tabs>
        <TabPane tab="手机验证" key="1">
            <MobileForm isMobileLogin={true} />
        </TabPane>
      </Tabs>
    )


    return (
        <div className={styles['validate-page']}>
            <Row justify="center" type="flex">
                <Col {...autoAdjust}>
                    <div className={styles['validate-block']}>
                        <Card 
                            style={{width: '100%',height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111'}}
                            headStyle={{color: '#2a8ff7'}}
                        >
                            {TabsDOM}
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
