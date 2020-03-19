import React, { useState } from 'react';
import styles from '../index.less';
import { Button, message, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ModalForm, { AthleteFormValues } from '@/components/athleteForm/modalForm';
import { addplayer, updatePlayer } from '@/services/athleteServices';
import { Dispatch } from 'dva';

// 表格接口 key 是编号
export interface Athlete {
  key: string;
  id: string;
  name: string;
  identifyID: string;
  sex: string;
  birthday: string;
  phone?: string;
  emergencyContact?: string | null;
  emergencyContactPhone?: string | null;
  action?: React.ReactNode;
}

interface AthleteListTableProps {
  loading: boolean;
  unitAccount: number;
  dataSource: any;
  unitId?: number;
  dispatch: Dispatch;
}

function AthleteListTable(props: AthleteListTableProps) {
  const { loading, unitAccount, dataSource, unitId, dispatch } = props;

  const editAthlete = (record: any) => {
    setInitialValue(record);
    setModalTitle('修改运动员：' + record.name);
    setIsAdd(false);
    setVisible(true);
  };

  const deleteAthlete = (key: string) => {};

  // modal props
  const [visible, setVisible] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加运动员');
  const [initialValue, setInitialValue] = useState<any>(null);
  // modal取消事件
  const onCancel = () => {
    if (visible) {
      setVisible(false);
    }
  };
  // 表单提交事件
  const onCreate = (values: AthleteFormValues) => {
    // 如果这次有上传图片，否则传个空字符串
    if (values.uploadPic) {
      emitData({ image: values.uploadPic[0], ...values });
    } else {
      emitData({ image: '', ...values });
    }
  };
  const emitData = (data: AthleteFormValues) => {
    let formData = new FormData();
    if (
      data.residence !== undefined &&
      data.residence.hasOwnProperty('city') &&
      data.residence.hasOwnProperty('address')
    ) {
      formData.append(
        'province',
        data.residence.city !== undefined ? data.residence.city.join('-') : '',
      );
      formData.append(
        'address',
        data.residence.address !== undefined ? data.residence.address : '',
      );
    } else {
      formData.append('province', '');
      formData.append('address', '');
    }
    formData.append('idcard', data.identifyNumber);
    formData.append('name', data.name);
    formData.append('idcardtype', data.idCardType);
    formData.append('sex', data.sex);
    formData.append('birthday', data.birthday.format('YYYY-MM-DD hh:mm:ss'));
    formData.append('phonenumber', data.phone !== undefined ? data.phone : '');
    formData.append('email', data.email !== undefined ? data.email : '');
    formData.append('face', data.image.originFileObj !== undefined ? data.image.originFileObj : '');
    formData.append('emergencycontactpeople', data.emergencyContact ? data.emergencyContact : '');
    formData.append(
      'emergencycontactpeoplephone',
      data.emergencyContactPhone ? data.emergencyContactPhone : '',
    );
    formData.append('unitdata', unitId ? String(unitId) : '');

    let res: Promise<any>;
    if (isAdd) {
      res = addplayer(formData);
    } else {
      res = updatePlayer(formData);
    }
    res.then(resp => {
      if (resp) {
        dispatch({
          type: 'user/getAccountData',
        });
        message.success(isAdd ? '添加成功' : '修改成功');
        setVisible(false);
      }
    });
    res.finally(() => {});
  };
  // 添加运动员按钮触发事件
  const addAthlete = () => {
    setInitialValue(null);
    setModalTitle('添加运动员');
    setIsAdd(true);
    setVisible(true);
  };
  // 修改/删除Node
  const changeOrDelDOM = (text: any, record: Athlete) => {
    return (
      <div>
        <a
          href="#"
          onClick={() => {
            editAthlete(record);
          }}
        >
          修改
        </a>
        &nbsp;&nbsp;
        {unitAccount === 1 ? null : (
          <a
            href="#"
            style={{ color: '#f5222d' }}
            onClick={() => {
              deleteAthlete(record.key);
            }}
          >
            删除
          </a>
        )}
      </div>
    );
  };

  const tableColumns: ColumnProps<Athlete>[] = [
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '性别', dataIndex: 'sex', key: 'sex', align: 'center' },
    { title: '证件号', dataIndex: 'idcard', key: 'idcard', align: 'center' },
    { title: '出生日期', dataIndex: 'birthday', key: 'birthday', align: 'center' },
    { title: '操作', key: 'action', align: 'center', render: changeOrDelDOM },
  ];

  return (
    <div>
      <Button type="primary" style={{ marginBottom: '1rem' }} onClick={addAthlete}>
        添加运动员
      </Button>
      <Table
        loading={loading}
        size="small"
        rowKey={record => record.id}
        columns={tableColumns}
        dataSource={dataSource}
      />
      <ModalForm
        visible={visible}
        isAdd={isAdd}
        onCreate={onCreate}
        onCancel={onCancel}
        title={modalTitle}
        initialValue={initialValue}
        loading={loading}
        haveContact={true}
      />
    </div>
  );
}

export default AthleteListTable;
