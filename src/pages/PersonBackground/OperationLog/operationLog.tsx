import React from 'react';
import styles from './index.less';
import { Form, Input, Table } from 'antd';
import useFormTable from '@umijs/hooks/es/useFormTable';
// @ts-ignore
import { PaginatedParams } from '@umijs/hooks/useFormTable/lib';
import axiosInstance from '@/utils/request';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: Object,
): Promise<any> => {
  return axiosInstance.get('/operationlog/').then(res => {
    return {
      list: res,
      // @ts-ignore
      total: res.length,
    };
  });
};

function OperationLog(props: any) {
  const [form] = Form.useForm();

  const { tableProps, search } = useFormTable(getTableData, {
    defaultPageSize: 20,
    form,
  });

  const { type, changeType, submit, reset } = search;

  const columns = [
    {
      title: '操作类型',
      dataIndex: 'operation',
      width: 400,
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      width: 400,
    },
  ];

  const searchForm = (
    <div style={{ marginTop: '1.5rem' }}>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="name">
          <Input.Search placeholder="操作名" style={{ width: 240 }} onSearch={submit} />
        </Form.Item>
      </Form>
    </div>
  );

  return (
    <div className={styles.log}>
      <PageHeaderWrapper />
      {searchForm}
      <Table columns={columns} size={'small'} bordered rowKey="time" {...tableProps} />
    </div>
  );
}

export default OperationLog;
