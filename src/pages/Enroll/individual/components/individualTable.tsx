import React from 'react';
import styles from '../index.less';
import { Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';

const { Option } = Select;

interface IndividualTableProps {
  loading: boolean;
  enrollAthleteList: any;
}

function IndividualTable(props: IndividualTableProps) {
  const { loading, enrollAthleteList } = props;

  // 点击报名触发事件
  const selectIndividualEnroll = (record: any) => {};

  const tableColumns: Array<ColumnProps<any>> = [
    {
      title: '姓名',
      key: 'name',
      render: (_: any, record: any) => <span>{record.athlete.name}</span>,
      align: 'center',
    },
    { title: '所属组别', key: 'group', dataIndex: 'groupage', align: 'center' },
    {
      title: '已参赛未升组项目',
      key: 'enrolledItem',
      dataIndex: 'project',
      align: 'center',
      render: (text: any): React.ReactNode => {
        const { personaldata } = text;
        return (
          <div style={{ fontSize: '10px', color: '#52c41a' }}>
            {personaldata.length !== 0 ? (
              personaldata.map((v: any) => (
                <p key={v.id}>
                  <span>{v.name}</span>
                </p>
              ))
            ) : (
              <span key={Math.random()}>--</span>
            )}
          </div>
        );
      },
    },
    {
      title: '已参赛升组项目',
      key: 'enrolledUploadItem',
      dataIndex: 'project',
      align: 'center',
      width: 200,
      render: (text: any): React.ReactNode => {
        const { upgrouppersonaldata } = text;
        return (
          <div style={{ fontSize: '10px', color: '#52c41a' }}>
            {upgrouppersonaldata.length !== 0 ? (
              upgrouppersonaldata.map((v: any) => (
                <p key={v.id}>
                  <span>{v.name}</span>
                </p>
              ))
            ) : (
              <span key={Math.random()}>--</span>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'h',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any): React.ReactNode => (
        <a onClick={() => selectIndividualEnroll(record)}>报名</a>
      ),
    },
  ];

  // TODO 已报名项目做成tag
  return (
    <Table
      loading={loading}
      dataSource={enrollAthleteList}
      columns={tableColumns}
      size={'small'}
      rowKey={record => record.id}
    />
  );
}

export default IndividualTable;
