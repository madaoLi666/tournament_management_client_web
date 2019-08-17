import React, { useState } from 'react';
import { Input, Cascader } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';

const RESIDENCE_DATA = require('./residence.json');
const changeResidenceData2Option = (data: object): Array<CascaderOptionType>|undefined => {
    // 判断是否为object
    const objFlag = Object.prototype.toString.call(data) === '[object Object]';
    if (objFlag) {
      // 是 遍历对象下层的每个key值
      const keyArr = Object.keys(data);
      let res: Array<CascaderOptionType> = [];
      if (keyArr.length !== 0) {
        keyArr.forEach(v => {
          res.push({
            label: v, value: v, key: `${Math.random()}-${v}`,
            // @ts-ignore
            children: changeResidenceData2Option(data[v])
          });
        });
      }
      return res;
    }
    const arrFlag = Object.prototype.toString.call(data) === '[object Array]';
    if (arrFlag) {
      // 到了city层
      let cityArr: Array<CascaderOptionType> = [];
      // @ts-ignore
      data.forEach((v: any) => {
        cityArr.push({ label: v, value: v, key: `c-${v}` });
      });
      return cityArr;
    }
    return undefined;
  };

/*
* @params
*
* value:{
*   residence: Array<string>
*   address: string
* }
*
* onChange: Function
*
* */
function AddressInput ({value = {}, onChange}:any, ref:any){

  const [city, setCity] = useState(value.city || []);
  const [address, setAddress] = useState(value.address || '');

  const r = changeResidenceData2Option(RESIDENCE_DATA);

  function triggerChange(changeValue:any):void{
    if(onChange){
      onChange(Object.assign({},{city: city,address: address}, changeValue))
    }
  }

  return (
    <div ref={ref}>
      <Input.Group compact={true}>
        <Cascader
          placeholder="请选择省份城市"
          options={r}
          style={{width: '30%'}}
          onChange={value => {
            setCity(value);
            triggerChange({city: value})
          }}
        />
        <Input
          style={{width: '70%'}}
          placeholder='请输入地址信息'
          onChange={({target: { value : address}}) => {
            setAddress(address);
            triggerChange({address})
          }}
        />
      </Input.Group>
    </div>
  )
}

export default React.forwardRef(AddressInput);

