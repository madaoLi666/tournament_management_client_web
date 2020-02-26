import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import EnrollHeader from '@/pages/Enroll/components/enrollHeader';
import { Button, message, Select, Table } from 'antd';
import { deleteTeam } from '@/services/enrollServices';
import TeamModal from '@/pages/Enroll/teamEnroll/components/teamModal';

const { Option } = Select;

interface TeamEnrollProps {
  teamEnroll?: Array<any>;
  athleteList?: Array<any>;
  matchId?: string;
  teamItem?: Array<any>;
  unitId: number;
  individualLimitation: any;
  loading: boolean;
  contestant_id: number;
  dispatch: Dispatch;
}

function TeamEnroll(props: TeamEnrollProps) {
  const {
    matchId,
    unitId,
    dispatch,
    contestant_id,
    athleteList,
    individualLimitation,
    loading,
    teamEnroll,
    teamItem,
  } = props;

  useEffect(() => {
    if (matchId && unitId) {
      dispatch({
        type: 'enroll/checkIsEnrollAndGetAthleteLIST',
        payload: { matchId, unitId, contestant_id },
      });
    }
  }, [matchId, unitId, contestant_id]);

  /**************** table *********************/
  const showTableColumns = [
    { title: '项目-组别-性别', dataIndex: 'itemGroupSexName', key: 'itemGroupSexName' },
    { title: '队伍名称', dataIndex: 'teamName', key: 'teamName' },
    {
      title: '操作',
      key: 'del',
      dataIndex: 'id',
      render: (text: number) => <a onClick={() => handleDeleteTeamEnroll(text)}>删除</a>,
    },
  ];
  // 删除队伍函数
  const handleDeleteTeamEnroll = (id: number) => {
    if (!teamEnroll) {
      console.error('[teamEnroll] teamEnroll is undefined');
      return;
    }
    for (let i: number = 0; i < teamEnroll.length; i++) {
      if (teamEnroll[i].id === id) {
        id = teamEnroll[i].member[0].teamenroll;
        break;
      }
    }
    deleteTeam({ teamenroll: id }).then(data => {
      if (data) {
        dispatch({
          type: 'enroll/checkIsEnrollAndGetAthleteLIST',
          payload: { matchId, unitId, contestant_id: contestant_id },
        });
        message.success('删除成功');
      } else {
        message.error('删除失败！');
      }
    });
  };
  // 表格折叠函数
  const renderExpandedRow = (record: any): React.ReactNode => {
    const { member } = record;
    if (!athleteList) {
      console.error('athleteList is null');
      return;
    }
    // 从props中找数据进行匹配，以获得组员的一些信息，如 性别 和 所在组别
    let sexs = new Array(member.length);
    let group_ages = new Array(member.length);

    for (let j: number = 0; j < member.length; j++) {
      for (let i: number = 0; i < athleteList.length; i++) {
        if (member[j].athlete.idcard === athleteList[i].athlete.idcard) {
          sexs[j] = athleteList[i].athlete.sex;
          group_ages[j] = athleteList[i].groupage;
          break;
        }
      }
    }
    let r: Array<React.ReactNode> = [];
    member.forEach((v: any, index: any) => {
      r.push(
        <div key={v.player}>
          <span>姓名：{v.athlete.name}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
          <span>角色名称：{v.rolename}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
          <span>性别：{sexs[index]}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
          <span>所属组别：{group_ages[index]}</span>
        </div>,
      );
    });
    return r;
  };

  /*************** modal *******************/
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <EnrollHeader
        title={'团队赛报名'}
        buttonDom={
          <Button onClick={() => setModalVisible(true)} type="primary">
            开设队伍
          </Button>
        }
      />
      <Table
        dataSource={teamEnroll}
        columns={showTableColumns}
        expandedRowRender={renderExpandedRow}
        rowKey={(record: any) => record.id}
        size={'small'}
        loading={loading}
      />
      <TeamModal onCancel={closeModal} visible={modalVisible} />
    </div>
  );
}

const mapStateToProps = ({ loading, enroll, router }: ConnectState) => {
  const teamId = router.location.query.teamId;
  const { teamItem } = enroll;
  let filter_athlete_list: any[] | undefined = [];
  filter_athlete_list = enroll.unit?.athleteList.filter((v: any) => {
    return v.active === 1;
  });

  return {
    teamItem: teamItem,
    matchId: String(enroll.currentMatchId),
    unitId: enroll.unitInfo.id,
    athleteList: filter_athlete_list?.map((v: any) => ({ ...v, role: '', groupFlag: false })),
    individualLimitation: enroll.individualLimitation,
    teamEnroll: enroll.unit?.teamEnrollList,
    loading: loading.global,
    // 队伍id
    contestant_id: Number(teamId),
  };
};

export default connect(mapStateToProps)(TeamEnroll);
