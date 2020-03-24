import React, { useRef, useState } from 'react';
import styles from '../index.less';
import { message, Table, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import EnrollModal from '@/pages/Enroll/individual/components/enrollModal';
import { connect, Dispatch } from 'dva';
import { deleteIndividualEnroll, individualEnroll } from '@/services/enrollServices';

interface IndividualTableProps {
  loading: boolean;
  enrollAthleteList: any;
  individualItemList: any;
  individualLimitation: any;
  group_age_list: any;

  dispatch: Dispatch;
  matchId?: string;
  unitId?: number;
  contestant_id?: number;
}

function IndividualTable(props: IndividualTableProps) {
  const {
    loading,
    enrollAthleteList,
    individualItemList,
    individualLimitation,
    group_age_list,
    contestant_id,
    dispatch,
    matchId,
    unitId,
  } = props;
  // 传递给modal的信息
  const [currentAthleteData, setCurrentAthleteData] = useState<any>({});
  const [itemGroupSexID, setItemGroupSexID] = useState(-1);
  const [athleteName, setAthleteName] = useState('');
  // 模态框控制
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const modalRef = useRef<any>();

  // 点击报名触发事件
  const selectIndividualEnroll = (record: any) => {
    setModalVisible(true);
    setCurrentAthleteData(record);
    setItemGroupSexID(-1);
    setAthleteName(record.athlete.name);
  };

  const tableColumns: Array<ColumnProps<any>> = [
    {
      title: '姓名',
      key: 'name',
      render: (_: any, record: any) => <span>{record.athlete.name}</span>,
      align: 'center',
      width: 120,
    },
    { title: '所属组别', key: 'group', dataIndex: 'groupage', align: 'center', width: 120 },
    {
      title: '已参赛未升组项目',
      key: 'enrolledItem',
      dataIndex: 'project',
      align: 'center',
      render: (text: any): React.ReactNode => {
        const { personaldata } = text;
        return (
          <div>
            {personaldata.length !== 0 ? (
              personaldata.map((v: any) => (
                <Tag closable onClose={onDelete.bind(event, v.id)} color="green" key={v.id}>
                  {v.name}
                </Tag>
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
      render: (text: any): React.ReactNode => {
        const { upgrouppersonaldata } = text;
        return (
          <div>
            {upgrouppersonaldata.length !== 0 ? (
              upgrouppersonaldata.map((v: any) => (
                <Tag closable onClose={onDelete.bind(event, v.id)} color="blue" key={v.id}>
                  {v.name}
                </Tag>
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
      width: 80,
      render: (_: any, record: any): React.ReactNode => (
        <a onClick={() => selectIndividualEnroll(record)}>报名</a>
      ),
    },
  ];

  const onCancel = () => {
    setModalVisible(false);
    modalRef.current.resetValue();
  };
  // 报名提交触发事件
  const onEnroll = (athleteData: any, id: number) => {
    if (id === -1) {
      message.warning('请选择正确的报名信息');
      return;
    }
    setConfirmLoading(true);
    if (id !== -1) {
      /*
       * 1、检查是否存在相同的项目
       * */
      let enrollData = { player: athleteData.player, openprojectgroupsex: id };
      individualEnroll(enrollData)
        .then(data => {
          if (data) {
            dispatch({
              type: 'enroll/checkIsEnrollAndGetAthleteLIST',
              payload: { matchId, unitId, contestant_id },
            });
            message.success('报名成功');
            setModalVisible(false);
            modalRef.current.resetValue();
          }
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    }
  };
  // 删除报名项目触发事件
  const onDelete = (id: number, e: any) => {
    setConfirmLoading(true);
    deleteIndividualEnroll({ personalprojectenroll: id })
      .then(data => {
        if (data) {
          message.success('删除成功');
        } else {
          // message.error('删除失败！请重新刷新页面以获取原来的数据');
          message.error('删除失败！');
        }
      })
      .finally(() => {
        dispatch({
          type: 'enroll/checkIsEnrollAndGetAthleteLIST',
          payload: { matchId, unitId, contestant_id },
        });
        setConfirmLoading(false);
      });
  };

  return (
    <div>
      <Table
        loading={loading || confirmLoading}
        dataSource={enrollAthleteList}
        columns={tableColumns}
        size={'small'}
        rowKey={record => record.id}
        scroll={{ x: 980 }}
      />
      <EnrollModal
        visible={modalVisible}
        individualItemList={individualItemList}
        individualLimitation={individualLimitation}
        onCancel={onCancel}
        group_age_list={group_age_list}
        currentAthleteData={currentAthleteData}
        setCurrentAthleteData={setCurrentAthleteData}
        athleteName={athleteName}
        setAthleteName={setAthleteName}
        itemGroupSexID={itemGroupSexID}
        setItemGroupSexID={setItemGroupSexID}
        ref={modalRef}
        onEnroll={onEnroll}
        loading={confirmLoading}
      />
    </div>
  );
}

export default IndividualTable;
