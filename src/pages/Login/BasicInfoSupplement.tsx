import React,{ Component } from 'react';
import { Form, Input, Row, Col, Select, DatePicker, Button, Card, message } from 'antd';
import { FormComponentProps, FormProps, ValidateCallback } from 'antd/lib/form';
import { ColProps } from 'antd/lib/grid';
import { connect, DispatchProp } from 'dva';
import moment, { Moment } from 'moment'
import { checkIDCard } from '@/utils/regulars';
// @ts-ignore
import styles from './index.less'

const { Option } = Select;
// 表单属性
interface BasicInfoSupplementFormProps extends FormComponentProps {
  emitData:(data: any) => void
}

// 表单样式
const BasicInfoSupplementStyle: FormProps = {
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
// 自适应
const autoAdjust: ColProps = {
  xs: { span: 20 },
  sm: { span: 18 },
  md: { span: 16 },
  lg: { span: 12 },
  xl: { span: 12 },
  xxl: { span: 8 },
};

class BasicInfoSupplementForm extends Component<BasicInfoSupplementFormProps, any>{
  constructor(props: BasicInfoSupplementFormProps){
    super(props);
    this.state = {
      isIDCard:false
    }
  }
  // 提交信息
  handleSubmit = (e: React.FormEvent): void => {
    // 阻止冒泡
    e.preventDefault();
    const { emitData } = this.props;
    this.props.form.validateFieldsAndScroll((err: ValidateCallback<any>, values: any) => {
      if (!err) {
        console.log(values);
        let isBirthdayValid = values.birthday as Moment;
        if(!isBirthdayValid.isValid()) {
          message.error('请确认身份证的出生日期是否正确!');
          return;
        }
        emitData(values);
      }
    });
  };
  // 处理填写身份证事件
  handleIDCardChange = (rule: any, value: any, callback: Function) => {
    const { isIDCard } = this.state;
    const { setFieldsValue } = this.props.form;
    // 证件类型为身份证
    if(!isIDCard || value === undefined){
      console.log('a');
      callback(); return;
    }
    // 长度是否为18
    if(value !== undefined && value.length !== 18) {
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
    callback('请输入正确的身份证号');
    return;
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isIDCard } = this.state;


    return (
      <Form
        {...BasicInfoSupplementStyle}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label='姓名'>
          {getFieldDecorator('name',{
            rules:[{required:true, message: '请输入真实姓名'}]
          })(
            <Input placeholder='请输入真实姓名' autoComplete='off' />
          )}
        </Form.Item>
        <Form.Item label='证件类型'>
          {getFieldDecorator('certificationType',{
            initialValue:'身份证',
            rules:[{required:true, message: '请选证件类型'}]
          })(
            <Select placeholder='请选择证件类型' onChange={this.handlerCertificationTypeChange}>
              <Option value='身份证'>身份证</Option>
              <Option value='港澳通行证'>港澳通行证</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label='证件号'>
          {getFieldDecorator('certificationNumber',{
            rules:[{required:true, message: '请填写证件号码'},{validator: this.handleIDCardChange}],
            trigger: 'onChange'
          })(
            <Input
              placeholder='请填写证件号码'
              autoComplete='off'
            />
          )}
        </Form.Item>
        <Form.Item label='性别'>
          {getFieldDecorator('sex',{
            rules:[{required:true, message: '请选择你的性别'}]
          })(
            <Select disabled={isIDCard}>
              <Option value='男'>男</Option>
              <Option value='女'>女</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label='出生年月日'>
          {getFieldDecorator('birthday',{
            rules:[{required:true, message: '请填写出生年月日'}]
          })(
            <DatePicker
              style={{width: '100%'}}
              disabled={isIDCard}
            />
          )}
        </Form.Item>
        <br/>
        <br/>
        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          <Button
            type='primary'
            htmlType='submit'
            style={{width: '100%'}}
          >
            点击提交
          </Button>
        </Form.Item>

      </Form>

    )
  }
}

const BISForm = Form.create<BasicInfoSupplementFormProps>()(BasicInfoSupplementForm);

function BasicInfoSupplement(props:any) {

  function submitInfoSupplementData(data: any):void{
    const { dispatch, userId } = props;
    console.log(userId);
    // 解析moment对象拿birthday
    data.birthday = data.birthday.format('YYYY-MM-DD') + ' 00:00:00';
    data.user = userId;
    console.log(data);
    // 提交做请求
    dispatch({type: 'register/addAthleteBaseInfo',payload:data})
  }

  return (
    <div className={styles['info-supplement-page']}>
      <Row type="flex" justify="center">
        <Col {...autoAdjust}>
          <Card
            style={{ width: '100%', height: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #111' }}
            headStyle={{ color: '#2a8ff7' }}
            title='请填写您的基本信息'
          >
            <BISForm
              emitData={submitInfoSupplementData}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default connect(({login}:any) => {
  let userId:number = login.userId;
  if(userId === -1) userId = Number(window.localStorage.getItem('USER'));
  return { userId: userId }
})(BasicInfoSupplement);

