import React from 'react';
import { Table, Button } from 'antd';

import { connect } from 'dva';
import { router } from 'umi';

import { ColumnProps } from 'antd/lib/table';


const ExaminationTable = (props: any) => {
  const { dispatch } = props;

  const enterExaminationDetail = (record: any) => {
    dispatch({
      type: 'amateur/setCurrentAmateurExaminationData',
      payload: { data: record }
    });
    router.push(`/amateurlevel/examieeunit`)
  }

  const tableColumns: Array<ColumnProps<any>> = [
    { title: '比赛名称', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '举办地点', dataIndex: 'rpaddress', key: 'rpaddress', align: 'center' },
    {
      title: '报名时间', key: 'enrolltime', align: 'center',
      render: (_, record) => (<div>{record.enrollstarttime.slice(0, 10)}~{record.enrollendtime.slice(0, 10)}</div>)
    },
    {
      title: '举办时间', key: 'rptime', align: 'center',
      render: (_, record) => (<div>{record.rpstarttime.slice(0, 10)}~{record.rpendtime.slice(0, 10)}</div>)
    },
    {
      title: '操作', align: 'center',
      render: (_, record) => {
        return (
          <div>
            {record.status === '报名中' ? (
              <Button
                type={'primary'}
                onClick={() => enterExaminationDetail(record)}
              >
                进入报名
              </Button>
            ) : (
              <Button
                disabled={true}
                // onClick={() => router.push(`/home/introduction?name=${encodeURI(v.name)}`)}
              >
                报名已结束
              </Button>
            )}
          </div>
        )
      }
    }
  ];

  return (
    <div>
      <Table
        dataSource={props.data}
        columns={tableColumns}
        rowKey={(record) => record.id}
      />
    </div>
  )
}

export default connect()(ExaminationTable);