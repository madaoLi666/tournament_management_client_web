import React from 'react';
import { Cascader, Form, Input } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';

/** object如下
 * residence: {
 *   city: { 
 *     area
 *   }
 * } 
 */

const RESIDENCE_DATA = require('../../assets/residence.json');

/*
  地区选择器，可优化地方有将静态文件的JSON放去服务器中
  使用时只需要在Form下面引入这个,然后提交表单获取值就能看到值
  初始化也是直接用上层Form的initialValue来初始化
 */

interface AddressInputProps {
  form?: any;
  require?: boolean;
}

const changeResidenceData2Option = (data: any): Array<CascaderOptionType> | undefined => {
  // 判断是否为object
  const objFlag = Object.prototype.toString.call(data) === '[object Object]';
  if (objFlag) {
    // 是 遍历对象下层的每个key值
    const keyArr = Object.keys(data);
    let res: Array<CascaderOptionType> = [];
    if (keyArr.length !== 0) {
      keyArr.forEach(v => {
        res.push({
          label: v,
          value: v,
          key: `${Math.random()}-${v}`,
          children: changeResidenceData2Option(data[v]),
        });
      });
    }
    return res;
  }
  const arrFlag = Object.prototype.toString.call(data) === '[object Array]';
  if (arrFlag) {
    // 到了city层
    let cityArr: Array<CascaderOptionType> = [];
    data.forEach((v: any) => {
      cityArr.push({ label: v, value: v, key: `${Math.random()}-${v}` });
    });
    return cityArr;
  }
  return undefined;
};

function AddressInput(props: AddressInputProps) {
  const { require } = props;
  const residences = changeResidenceData2Option(RESIDENCE_DATA);

  return (
    // 这个 style 是因为有重复的两个 Item 标签，所以清除一个的 marginBottom
    <Form.Item label="地址" required={!!require} style={{ marginBottom: 0 }}>
      <Input.Group compact>
        <Form.Item
          style={{ width: '40%' }}
          name={['residence', 'city']}
          rules={require ? [{ type: 'array', required: true, message: '请选择所在地' }] : []}
        >
          <Cascader placeholder={require ? '请选择' : '选填'} options={residences} />
        </Form.Item>
        <Form.Item
          style={{ width: '60%' }}
          name={['residence', 'address']}
          rules={require ? [{ required: true, message: '请输入地址信息' }] : []}
        >
          <Input placeholder={require ? '请输入地址信息' : '选填'} />
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );
}

export default AddressInput;
