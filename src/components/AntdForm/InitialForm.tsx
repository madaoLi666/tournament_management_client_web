import * as React from 'react';
import Form, { FormComponentProps } from 'antd/lib/form';
import { InputNumber, Switch, Select, Checkbox, Radio, DatePicker } from 'antd';
import moment from 'moment';
import { render } from 'react-dom';

const { RangePicker } = DatePicker;

/*
* @params
*
*  > 适用于所有的类型
*  *  type { 类型 }
*  *  field { 生成form表单的key，用于取值 }
*     label { 标题，置于 }
*     width { item的宽度 }
*     height { item的高度 }
*
*  *  initialValue { 初始值 }
*     labelSpan { label宽度 | 24为总宽度}
*     wrapperSpan { wrapper宽度 | 24为总宽度}
*     wrapperOffset { wrapper宽度 | 24为总宽度}
*     wrapperOffset { wrapper宽度 | 24为总宽度}
*     tip { 提示 }
*  *  rules { 验证规则 }
*     placeholder { placeholder }
*
*   > 适用于的 checkbox select radio_group
*     list { 选项的列表 }
*
*   > 适用于inputNumber
*     min { inputNumber 最小可选数组 }
*     max { inputNumber 最大可选数组 }
* */

// select/radios/checkbox 的list
export interface ItemList {
    label: string | number
    value: string | number
  }

export interface ItemProps {
    // all types required
    type: string
    field: string
    label?: string | React.ReactNode
    initialValue?: any
    tip?: string | React.ReactNode
    rules?: any
    placeholder?: string
    
    // checkbox select radio_group
    list?: Array<ItemList>

    // inputnumber
    max?: number
    min?: number

    // style
    labelCol?: object
    wrapperCol?: object
    width?: string
    height?: string
    margin_bottom?: string
}

export interface FormStyle {
    formLayout: any
    formItemLayout: { labelCol:object, wrapperCol: object }
}

export interface FormProps extends FormComponentProps {
    formItem: Array<ItemProps>
    handler: any
    formStyle: FormStyle
}

let ItemHandler = function (itemProps: ItemProps, formStyle: FormStyle, getFieldDecorator: any, setFields: any): React.ReactNode {
    let itemDOM: any
    
    // style default
    let width: string = '',
        height: string = '',
        labelCol: object = {},
        wrapperCol: object = {};

    // 是否 inline
    if (formStyle.formLayout === 'inline') {
        if (itemProps.hasOwnProperty('width') && itemProps.width !== undefined ) {  
            width = itemProps.width;
        }
        if (itemProps.hasOwnProperty('labelCol') && itemProps.hasOwnProperty('label') && itemProps.labelCol !== undefined ) {
            labelCol = itemProps.labelCol;
        }
        if (itemProps.hasOwnProperty('wrapperCol') && itemProps.wrapperCol !== undefined ) {
            wrapperCol = itemProps.wrapperCol;
        }
        if (itemProps.hasOwnProperty('height') && itemProps.height !== undefined ) {
            height = itemProps.height;
        }
    }

    // item 填充
    switch (itemProps.type) {
        case 'text' :
            // 这里用来写 getFieldDecorator 的双向绑定问题
            itemDOM = getFieldDecorator(itemProps.field, {}) (
                <span className="ant-form-text" >{itemProps.field}</span>
            );
            break;
        case 'input' :
            itemDOM = getFieldDecorator(
                itemProps.field,
                { initialValue: itemProps.initialValue, rules: itemProps.rules }
            )
            break;
        case 'input_number' :
            itemDOM = getFieldDecorator (
                itemProps.field,
                { initialValue: itemProps.initialValue, rules: itemProps.rules }
            )(
                <InputNumber placeholder={itemProps.placeholder} max={itemProps.max} min={itemProps.min} />,
            );
            break;
        case 'switch' :
            itemDOM = getFieldDecorator (
                itemProps.field,
                { initialValue: itemProps.initialValue, rules: itemProps.rules }
            )(
                <Switch />
            );
            break;
        // 含list选择项
        case 'select' :
            const Option = Select.Option;
            let options: any[] = [];
            // 判断是否有list - 做options
            if (itemProps.hasOwnProperty('list') && itemProps.list !== undefined ) {
                itemProps.list.map(listItem => {
                    options.push(
                        <Option value={listItem.value} key={listItem.value} >{listItem.label}</Option>
                    );
                });
            } else {
                options.push(<span key='error' >没有list 或者 list 为 undefined </span>)
            }
            // 填充itemDOM
            itemDOM = getFieldDecorator(
                itemProps.field,
                { initialValue: itemProps.initialValue, rules: itemProps.rules }
            )(
                <Select placeholder={itemProps.placeholder} >
                    {options}
                </Select>
            );
            break;
        case 'checkbox_group' :
            let checkboxItems: any = [];
            // 判断是否有list - 做options
            if (itemProps.hasOwnProperty('list') && itemProps.list !== undefined ) {
                itemProps.list.map( listItem => {
                    checkboxItems.push(
                        <Checkbox value={listItem.value} key={listItem.value} >{listItem.label}</Checkbox>
                    );
                });
            } else {
                checkboxItems.push(<span key='error' >没有list 或者 list 为 undefined</span>)
            }
            // 填充itemDOM
            itemDOM = getFieldDecorator(
                itemProps.field,
                { initialValue: itemProps.initialValue, rules: itemProps.rules }
            )(
                <Checkbox.Group>
                    {checkboxItems}
                </Checkbox.Group>
            );
            break;
        case 'radio_group' :
            let radioItems: any = [];
            // 判断是否有list - 做options
            if (itemProps.hasOwnProperty('list') && itemProps.list !== undefined ) {
                itemProps.list.map( listItem => {
                    radioItems.push(
                        <Radio value={listItem.value} key={listItem.value} >{listItem.label}</Radio>
                    );
                });
            } else {
                radioItems.push(<span key='error' >没有list或者list为undefined</span>)
            }
            itemDOM = getFieldDecorator(
                itemProps.field,
                { initialValue: itemProps.initialValue, rules: itemProps.rules }
            )(
                <Radio.Group>
                    {radioItems}
                </Radio.Group>
            );
            break;
                /*
                * datePicker
                * 这里会返回一个momnet对象
                * 这个可以转格式
                * onChange={(dates) => console.log( dates[0].format('YYYY-MM-DD'))}
                * */
            case 'date_picker' :
                itemDOM = getFieldDecorator(
                    itemProps.field,
                    { initialValue: moment(), rules: itemProps.rules}
                )(
                    <DatePicker/>
                );
                break;
            case 'date_range_picker' :
                itemDOM = getFieldDecorator(
                    itemProps.field,
                    { initialValue: [moment('1970-01-01'),moment()], rules: itemProps.rules }
                )(
                    <RangePicker />
                );
                break;
            default :
                itemDOM = <span>不能辨别其属性</span>;
                break;
    }

    // 判断formStyle中是否有layout的值 没有return带labelCol的
    if (formStyle.formLayout === 'inline') {
        return (
            <Form.Item label={itemProps.label} key={itemProps.field} labelCol={itemProps.labelCol} wrapperCol={itemProps.wrapperCol} style={{width:width, marginBottom: itemProps['margin_bottom']}}>
                {itemDOM}
                <p style={{color:'red', fontSize: '10px'}} >{itemProps.tip}</p>
            </Form.Item>
        );  
    } else {
        return (
            <Form.Item label={itemProps.label} key={itemProps.field} colon={true} style={{width:width, marginBottom: itemProps['margin_bottom']}} >
                {itemDOM}
                <p style={{color:'red', fontSize: '10px'}} >{itemProps.tip}</p>
            </Form.Item>
        );
    }
};

class InitialForm extends React.Component<FormProps,{}>{
    constructor(props: any){
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    componentDidMount(): void {
      const { form ,handler } = this.props;
      if(handler){
        // 将提交方法、重置方法、设置值 传出
        handler(this.handleSubmit, form.resetFields, form.setFieldsValue);
      }
    }
  
    // 回return出去一个boolean
    handleSubmit():any {
      let res: any = false;
      this.props.form.validateFields((err, value) => {
        if(!err) {
          // 这里把表单验证值返回父类元素
          res = value;
        }
      });
      return res;
    };
  
    render() {
      const {form, formItem, formStyle} = this.props;
      // 拿表单绑定方法
      const { getFieldDecorator, setFields} = form;
      // 渲染表单信息
      let formDOM:any[] = [];
      formItem.map(v => {
        formDOM.push(ItemHandler(v,formStyle,getFieldDecorator,setFields));
      });
      // @ts-ignore
      return (
        <div>
          <Form
            layout={formStyle.formLayout}
            labelCol={formStyle.formItemLayout.labelCol}
            wrapperCol={formStyle.formItemLayout.wrapperCol}
          >
            {formDOM}
          </Form>
        </div>
      );
    }
  }
  
  export default Form.create<FormProps>({})(InitialForm);

