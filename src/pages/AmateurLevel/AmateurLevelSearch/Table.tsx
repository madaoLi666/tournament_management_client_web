import React from 'react';
import { Table } from 'antd';
import router from 'umi/router';

import { ColumnProps } from 'antd/lib/table';

/**
 * 
 * @param str string - UTC
 */
function formatData(str: string) {
  const date = new Date(str)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

const AmateurLevelSearchTable = (props: {data: any}) => {

  const resultMapping = {
    "Y": "通过",
    "N": "未通过",
    "W": "弃考"
  }

  const tableColumns: Array<ColumnProps<any>> = [
    { title: '考评项目', dataIndex: 'clas_name', key: 'clas_name',align: 'center' },
    { title: '考评等级', dataIndex: 'level_name', key: 'level_name',align: 'center' },
    { 
      title: '考评时间',
      dataIndex: 'examination_date',
      key: 'examination_date',
      align: 'center',
      render: (dateStr) => formatData(dateStr)
    },
    { 
      title: '考评结果',
      dataIndex: 'result',
      key: 'result',
      align: 'center',
      render: (result: string) => (resultMapping[result] as string) || "-"
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

export default AmateurLevelSearchTable;