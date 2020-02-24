import React from 'react';
import styles from '../index.less';
import { Table, Button, message } from 'antd';
import { ColumnProps } from 'antd/lib/table/Column';
import {
  addParticipantsAthlete,
  deleteAthlete,
  deleteParticipantsAthlete,
} from '@/services/enrollServices';
import { Dispatch, connect } from 'dva';

interface AthleteList {
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
  handle?: React.ReactNode;
}

interface AthleteTableProps {
  dispatch: Dispatch;
  dataSource: any;
  loading: boolean;
  matchId?: number;
  unitId: number;
  contestant_id: number;
}

function AthleteTable(props: AthleteTableProps) {
  const {
    dispatch,
    dataSource,
    loading,
    contestant_id,
    matchId,
    unitId,
  } = props;

  // 选中运动员是否参赛
  function handle_add(record: any, e: React.MouseEvent) {
    const { birthday, id } = record.athlete;
    // 选中
    let reqData = {
      matchdata: matchId,
      contestant: contestant_id,
      unitathlete: record.id,
      birthday: birthday.slice(0, 10),
      athlete: id,
    };
    addParticipantsAthlete(reqData).then(data => {
      if (data) {
        dispatch({
          type: 'enroll/checkIsEnrollAndGetAthleteLIST',
          payload: { unitId, matchId, contestant_id },
        });
        message.success('确认成功');
      }
    });
  }

  function handle_delete(record: any, e: React.MouseEvent) {
    const { id } = record.athlete;
    // 先检查这个人是否有已经参加比赛的项目
    if (record.teamname.length !== 0) {
      message.warning('请先删除该运动员参加的团体项目');
      return;
    }
    deleteParticipantsAthlete({
      matchdata: matchId,
      athlete: id,
      contestant: contestant_id,
    }).then(data => {
      if (data)
        dispatch({
          type: 'enroll/checkIsEnrollAndGetAthleteLIST',
          payload: { unitId, matchId, contestant_id },
        });
    });
  }

  const editAthleteData = (record: any) => {
    console.log(record);
  };

  const handlerDelete = (id: number | string) => {
    deleteAthlete({ athlete: id, unitdata: unitId }).then(res => {
      if (res && res !== '') {
        dispatch({
          type: 'enroll/checkIsEnrollAndGetAthleteLIST',
          payload: { matchId, unitId, contestant_id },
        });
        message.success('删除成功!');
      }
    });
  };

  const tableColumns: ColumnProps<AthleteList>[] = [
    {
      title: '选择是否参赛',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      render: (text: number, record: any) => {
        return record.active === 1 ? (
          <Button
            onClick={event => handle_delete(record, event)}
            size="small"
            type="danger"
          >
            取消参赛
          </Button>
        ) : (
          <Button
            style={{ backgroundColor: '#52c41a', border: 'none' }}
            type="primary"
            onClick={event => handle_add(record, event)}
            size="small"
          >
            确认参赛
          </Button>
        );
      },
      fixed: 'left',
    },
    {
      title: '运动员姓名',
      key: 'name',
      align: 'center',
      render: (text: any, record: any) => <span>{record.athlete.name}</span>,
    },
    {
      title: '性别',
      key: 'sex',
      dataIndex: 'sex',
      align: 'center',
      render: (text: any, record: any) => <span>{record.athlete.sex}</span>,
    },
    {
      title: '证件号',
      key: 'identifyID',
      dataIndex: 'identifyID',
      align: 'center',
      render: (text: any, record: any) => <span>{record.athlete.idcard}</span>,
    },
    {
      title: '出生年月日',
      key: 'birthday',
      align: 'center',
      render: (text: any, record: any) => (
        <span>{record.athlete.birthday.slice(0, 10)}</span>
      ),
    },
    {
      title: '操作',
      key: 'handle',
      align: 'center',
      render: (text: any, record: any) => (
        <div>
          {/* 使用外层 - 单位运动员id */}
          <a
            onClick={() => {
              editAthleteData(record);
            }}
          >
            修改
          </a>
          &nbsp;|&nbsp;
          {/* 删除使用内层id 运动员id */}
          <a
            style={{ color: '#f5222d' }}
            onClick={() => {
              handlerDelete(record.athlete.id);
            }}
          >
            删除
          </a>
        </div>
      ),
    },
  ];
  // TODO 设置一下width看看
  return (
    <Table
      columns={tableColumns}
      dataSource={dataSource}
      size={'middle'}
      className={styles.antTableSmall}
      rowKey={record => record.id}
      loading={loading}
    />
  );
}

export default connect()(AthleteTable);
