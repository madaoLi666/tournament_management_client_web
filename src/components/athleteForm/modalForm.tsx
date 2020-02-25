import React, { useRef, useState } from 'react';
import { Form, message, Modal } from 'antd';
import AthleteForm from '@/components/athleteForm/athleteForm';

// 表单值
export interface AthleteFormValues {
  name: string;
  idCardType: string;
  identifyNumber: string;
  sex: string;
  birthday: any;
  phone?: string;
  email?: string;
  residence?: {
    city?: [];
    address?: string;
  };
  uploadPic?: any;
  image?: any;
}

interface ModalProps {
  visible: boolean;
  isAdd: boolean; // 是否是新增表单
  onCreate: (values: AthleteFormValues) => void; // 表单提交事件触发
  onCancel: () => void;
  title: string; // modal的标题
  initialValue: any; // 初始化值
  loading: boolean;
}

// 模态框包裹的表单
const ModalForm: React.FC<ModalProps> = (props: ModalProps) => {
  const { visible, onCancel, onCreate, isAdd, title, initialValue, loading } = props;

  const formRef = useRef({});

  const clearForm = () => {
    // 父组件控制显隐
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title={title}
      okText="提交"
      cancelText="取消"
      onCancel={clearForm}
      confirmLoading={loading}
      onOk={() => {
        formRef.current
          // @ts-ignore
          .validateFields()
          .then((values: any) => {
            // @ts-ignore
            formRef.current.resetFields();
            onCreate(values);
          })
          .catch((info: any) => {
            message.error(info.errorFields[0].errors[0]);
          });
      }}
    >
      {visible && <AthleteForm formRef={formRef} initialValue={initialValue} isAdd={isAdd} />}
    </Modal>
  );
};

export default ModalForm;
