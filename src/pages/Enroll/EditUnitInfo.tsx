import React,{ Component } from 'react';
import {
  Form, Input, Select, Button
} from 'antd'
import { FormComponentProps, FormProps } from 'antd/lib/form';

const { Option } = Select;

interface UnitInfoFormProps extends FormComponentProps{

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


  render(): React.ReactNode {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form {...UnitInfoFormStyle}>
        <Form.Item label='单位'>
          {getFieldDecorator('unitName',{})(<Input/>)}
        </Form.Item>
        <Form.Item label='参赛单位别名'>
          {getFieldDecorator('unitNameAlias',{})(<Input placeholder='可以使用别名参赛'/>)}
        </Form.Item>
        <Form.Item label='领队姓名'>
          {getFieldDecorator('leaderName',{
            rules: [{required: true, message: '请输入领队姓名'}]
          })(<Input/>)}
        </Form.Item>
        <Form.Item label='联系电话'>
          {getFieldDecorator('leaderPhone',{
            rules: [{required: true, message: '请输入领队联系电话'}]
          })(
            <Input placeholder='请输入领队联系电话'/>
            )}
        </Form.Item>
        <Form.Item label='领队邮箱'>
          {getFieldDecorator('leaderEmail',{
            rules: [{required: true, message: '请输入领队邮箱'}]
          })(
            <Input placeholder='请输入邮箱' />
          )}
        </Form.Item>
        <Form.Item label='教练1'>
          {getFieldDecorator('coach1Name',{})(
            <Input placeholder='请输入教练1名称' />
          )}
        </Form.Item>
        <Form.Item label='教练1电话号码'>
          {getFieldDecorator('coach1Phone',{})(
            <Input placeholder='请输入教练1电话号码' />
          )}
        </Form.Item>
        <Form.Item label='教练2姓名'>
          {getFieldDecorator('coach2Name',{})(
            <Input placeholder='请输入教练1名称' />
          )}
        </Form.Item>
        <Form.Item label='教练2电话号码'>
          {getFieldDecorator('coach2Phone',{})(<Input/>)}
        </Form.Item>

      </Form>
    )
  }
}

const UIForm = Form.create<UnitInfoFormProps>()(UnitInfoForm);

function EditUnitInfo(props:{}) {
  return (
    <div>
      <UIForm/>
    </div>
  )
}

export default EditUnitInfo;
