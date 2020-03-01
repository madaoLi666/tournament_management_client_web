import React from 'react';
import styles from '../index.less';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';

// 表格接口 key 是编号
export interface Athlete {
  key: string;
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
}

function AthleteListTable(props: AthleteListTableProps) {
  const { loading, unitAccount, dataSource } = props;

  const editAthlete = (record: any) => {};

  const deleteAthlete = (key: string) => {};

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
    { title: '编号', dataIndex: 'key', key: 'key', align: 'center' },
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '性别', dataIndex: 'sex', key: 'sex', align: 'center' },
    { title: '证件号', dataIndex: 'identifyID', key: 'identifyID', align: 'center' },
    { title: '出生日期', dataIndex: 'birthday', key: 'birthday', align: 'center' },
    { title: '操作', key: 'action', align: 'center', render: changeOrDelDOM },
  ];

  return (
    <Table
      loading={loading}
      size="small"
      rowKey={record => record.key}
      columns={tableColumns}
      dataSource={dataSource}
    />
  );
}

export default AthleteListTable;
