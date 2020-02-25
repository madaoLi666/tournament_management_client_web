import React from 'react';
import { Cascader, Form, Input } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';

const RESIDENCE_DATA = require('../../assets/residence.json');

/*
  地区选择器，可优化地方有将静态文件的JSON放去服务器中
  使用时只需要在Form下面引入这个,然后提交表单获取值就能看到值
  初始化也是直接用上层Form的initialValue来初始化
 */

interface AddressInputProps {
  form?: any;
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
  const residences = changeResidenceData2Option(RESIDENCE_DATA);

  return (
    <Form.Item label="地址">
      <Input.Group compact>
        <Form.Item name={'province'}>
          <Cascader placeholder={'选填'} options={residences} />
        </Form.Item>
        <Form.Item name={'address'}>
          <Input style={{ width: '100%' }} placeholder="选填" />
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );
}

export default AddressInput;
