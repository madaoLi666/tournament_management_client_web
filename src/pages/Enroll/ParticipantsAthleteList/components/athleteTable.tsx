import React, { useState } from 'react';
import styles from '../index.less';
import { Table, Button, message } from 'antd';
import { ColumnProps } from 'antd/lib/table/Column';
import {
  addParticipantsAthlete,
  deleteAthlete,
  deleteParticipantsAthlete,
} from '@/services/enrollServices';
import { Dispatch, connect } from 'dva';
import ModalForm, { AthleteFormValues } from '@/components/athleteForm/modalForm';
import { updatePlayer } from '@/services/athleteServices';

interface AthleteList {
  key: string;
  id: string;
  unitathlete_id: number;
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
  const { dispatch, dataSource, loading, contestant_id, matchId, unitId } = props;

  const [buttonLoading, setButtonLoading] = useState(false);

  const tableColumns: ColumnProps<AthleteList>[] = [
    {
      title: '选择是否参赛',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      render: (text: number, record: any) => {
        return record.active === 1 ? (
          <Button
            loading={buttonLoading}
            onClick={event => handle_delete(record, event)}
            size="small"
            // @ts-ignore
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
            loading={buttonLoading}
          >
            确认参赛
          </Button>
        );
      },
      fixed: 'left',
      width: 100,
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
      render: (text: any, record: any) => <span>{record.athlete.birthday.slice(0, 10)}</span>,
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

  // 选中运动员是否参赛
  const handle_add = (record: any, e: React.MouseEvent) => {
    const { birthday, id } = record.athlete;
    // 选中
    setButtonLoading(true);
    let reqData = {
      matchdata: matchId,
      contestant: contestant_id,
      unitathlete: record.id,
      birthday: birthday.slice(0, 10),
      athlete: id,
    };
    addParticipantsAthlete(reqData)
      .then(data => {
        if (data) {
          dispatch({
            type: 'enroll/checkIsEnrollAndGetAthleteLIST',
            payload: { unitId, matchId, contestant_id },
          });
          message.success('确认成功');
        }
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };
  // 取消参赛
  const handle_delete = (record: any, e: React.MouseEvent) => {
    const { id } = record.athlete;
    setButtonLoading(true);
    // 先检查这个人是否有已经参加比赛的项目
    if (record.teamname.length !== 0) {
      message.warning('请先删除该运动员参加的团体项目');
      setButtonLoading(false);
      return;
    }
    deleteParticipantsAthlete({
      matchdata: matchId,
      athlete: id,
      contestant: contestant_id,
    })
      .then(data => {
        if (data)
          dispatch({
            type: 'enroll/checkIsEnrollAndGetAthleteLIST',
            payload: { unitId, matchId, contestant_id },
          });
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };
  // 修改运动员信息
  const editAthleteData = (record: any) => {
    setAthlete(record);
    setModifyVisible(true);
  };
  // 删除运动员
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

  /************************** modal *******************/
  const [confirmLoading, setLoading] = useState(false);
  // modal框控制
  const [modifyVisible, setModifyVisible] = useState(false);
  // 要修改的运动员数据
  const [athleteInitial, setAthlete] = useState<any>(null);

  const onCancel = () => {
    if (modifyVisible) {
      setModifyVisible(false);
    }
  };
  // 提交表单的事件
  const onCreate = (values: AthleteFormValues) => {
    // 如果这次有上传图片，否则传个空字符串
    if (values.uploadPic) {
      emitData({ image: values.uploadPic[0], ...values });
    } else {
      emitData({ image: '', ...values });
    }
  };

  const emitData = (data: AthleteFormValues) => {
    setLoading(true);
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
    // formData.append('idcard', data.identifyNumber);
    formData.append('name', data.name);
    formData.append('idcardtype', data.idCardType);
    formData.append('sex', data.sex);
    formData.append('birthday', data.birthday.format('YYYY-MM-DD hh:mm:ss'));
    formData.append('phonenumber', data.phone !== undefined ? data.phone : '');
    formData.append('email', data.email !== undefined ? data.email : '');
    formData.append('face', data.image.originFileObj !== undefined ? data.image.originFileObj : '');
    formData.append('unitdata', unitId.toString());
    formData.append('unitathlete_id', athleteInitial === null ? 0 : athleteInitial.unitathlete_id);
    formData.append('unitdata_id', athleteInitial === null ? 0 : athleteInitial.unitdata_id);
    // 修改运动员数据
    updatePlayer(formData)
      .then(res => {
        if (res !== '') {
          dispatch({
            type: 'enroll/checkIsEnrollAndGetAthleteLIST',
            payload: { unitId, matchId, contestant_id },
          });
          message.success('修改成功！');
        }
        setModifyVisible(false);
        setLoading(false);
      })
      .catch(res => {
        setLoading(false);
      });
  };
  return (
    <>
      <Table
        columns={tableColumns}
        dataSource={dataSource}
        size={'small'}
        className={styles.antTableSmall}
        scroll={{ x: 800 }}
        rowKey={record => record.unitathlete_id}
        loading={loading}
      />
      <ModalForm
        initialValue={athleteInitial}
        isAdd={false}
        title={'修改运动员信息'}
        onCancel={onCancel}
        onCreate={onCreate}
        visible={modifyVisible}
        loading={confirmLoading}
      />
    </>
  );
}

export default connect()(AthleteTable);
