import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import { checkIDCard } from '@/utils/regulars';
import styles from '@/components/athleteForm/index.less';
import { DatePicker } from '@/components/DayJs';
import moment from 'dayjs';

/**
 * 表单的证件类型，证件号码，性别，出生年月四个填写项，抽离出来因为多处能用到
 * 使用时需要传入两项，一项为是否新增，另一项为表单实例，formRef
 */

const { Item } = Form;

interface IdFormProps {
  isAdd: boolean; // 是否新增信息（是新增的话就不会禁填身份证）
  formRef: any; // 表单实例，即 const form = useForm();
}

function IdForm(props: IdFormProps) {
  const { isAdd, formRef } = props;
  // 控制身份证类别
  const [isHongKong, setIsHongKong] = useState(false);

  // 证件类型change事件
  const handlerCertificationTypeChange = (value: string) => {
    if (value === '身份证') {
      setIsHongKong(false);
    } else {
      setIsHongKong(true);
    }
    formRef.current.resetFields(['identifyNumber', 'sex', 'birthday']);
  };

  const handleIDCardChange = (event: any) => {
    const idCard = event.target.value;
    // 证件类型为身份证
    if (isHongKong || idCard === undefined) {
      return;
    }
    // 未满18位
    if (idCard.length !== 18 && idCard.length !== 15) {
      formRef.current.setFieldsValue({
        sex: null,
        birthday: null,
      });
      return;
    }
    if (checkIDCard.test(idCard) && !isHongKong) {
      const birthday = `${idCard.slice(6, 10)}${idCard.slice(10, 12)}${idCard.slice(12, 14)}`;
      formRef.current.setFieldsValue({
        sex: idCard.slice(-2, -1) % 2 === 1 ? '男' : '女',
        birthday: moment(birthday),
      });
      return;
    }
  };

  return (
    <>
      <Item
        label="证件类型"
        rules={[{ required: true, message: '请选择你的证件号码类型' }]}
        name={'idCardType'}
      >
        <Select
          placeholder="请选择证件类型"
          disabled={!isAdd}
          onChange={handlerCertificationTypeChange}
        >
          <Select.Option value="身份证">身份证</Select.Option>
          <Select.Option value="港澳通行证">港澳台回乡证</Select.Option>
        </Select>
      </Item>
      <Item
        label="证件号码"
        name={'identifyNumber'}
        rules={
          isHongKong
            ? [{ required: true, message: '请填写证件号码' }]
            : [
                { required: true, message: '请填写证件号码' },
                { pattern: checkIDCard, message: '请输入正确的身份证号' },
              ]
        }
      >
        <Input
          disabled={!isAdd}
          onChange={handleIDCardChange}
          placeholder="请填写证件号码"
          autoComplete="off"
        />
      </Item>
      <Item rules={[{ required: true, message: '请选择运动员性别' }]} label="性别" name={'sex'}>
        <Select placeholder={'请选择运动员性别'} disabled={!isHongKong}>
          <Select.Option value="男">男</Select.Option>
          <Select.Option value="女">女</Select.Option>
        </Select>
      </Item>
      <Item
        label="出生年月日"
        name={'birthday'}
        rules={[{ type: 'object', required: true, message: '请选择出生年月日' }]}
        className={styles['require']}
      >
        <DatePicker
          placeholder={'请选择运动员出生日期'}
          style={{ width: '100%' }}
          disabled={!isHongKong}
        />
      </Item>
    </>
  );
}

export default IdForm;
