import React from 'react';
import { Form, Modal } from 'antd';
import AthleteForm from '@/components/athleteForm/athleteForm';

// 表单值
export interface AthleteFormValues {
  key: string;
  id: string;
  name?: string;
  active?: any;
  identifyID?: string;
  sex?: string;
  birthday?: string;
  phone?: string;
  emergencyContact?: string | null;
  emergencyContactPhone?: string | null;
}

interface ModalProps {
  visible: boolean;
  isAdd: boolean; // 是否是新增表单
  onCreate: (values: AthleteFormValues) => void;
  onCancel: () => void;
}

// 模态框包裹的表单
const ModalForm: React.FC<ModalProps> = (props: ModalProps) => {
  const { visible, onCancel, onCreate, isAdd } = props;
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: any) => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <AthleteForm form={form} isAdd={isAdd} />
    </Modal>
  );
};

export default ModalForm;
