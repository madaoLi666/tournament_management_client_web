import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import EnrollHeader from '@/pages/Enroll/components/enrollHeader';
import { Button, Cascader, message, Table } from 'antd';
import { deleteTeam, handleTeamEnroll } from '@/services/enrollServices';
import TeamModal from '@/pages/Enroll/teamEnroll/components/teamModal';
import { TeamItem, TeamProjectItem } from '@/pages/Enroll/teamData';
import { selectTeam } from '@/utils/enroll';
import { router } from 'umi';

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

  const [tableLoading, setTableLoading] = useState(false);
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
      message.error('[teamEnroll] teamEnroll is undefined');
      console.error('[teamEnroll] teamEnroll is undefined');
      return;
    }
    setTableLoading(true);
    for (let i: number = 0; i < teamEnroll.length; i++) {
      if (teamEnroll[i].id === id) {
        id = teamEnroll[i].member[0].teamenroll;
        break;
      }
    }
    deleteTeam({ teamenroll: id })
      .then(data => {
        if (data) {
          dispatch({
            type: 'enroll/checkIsEnrollAndGetAthleteLIST',
            payload: { matchId, unitId, contestant_id: contestant_id },
          });
          message.success('删除成功');
        } else {
          message.error('删除失败！');
        }
      })
      .finally(() => {
        setTableLoading(false);
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

  /*============================ Select ======================================*/
  const [teamEnrollData, setTeamEnrollData] = useState<any[]>([]);
  const [currentItemGroupSexID, setCurrentItemGroupSexID] = useState<any>(-1);
  // 在这里初始化选择器
  useEffect(() => {
    if (!teamItem) {
      return;
    }
    let tempTeamItem: Array<TeamProjectItem> = [];
    if (teamItem.length !== 0) {
      // 将信息push进数组中
      const team = teamItem as TeamItem[];
      tempTeamItem = selectTeam(team);
    }
    setTeamEnrollData(tempTeamItem);
  }, [teamItem]);
  // 监听点击事件
  const clickItem = (groups: string[]) => {
    if (groups === undefined || groups === null) {
      console.error('[队伍选择器点击时]groups is undefined:' + JSON.stringify(groups));
      message.error('[队伍选择器点击时]groups is undefined:' + JSON.stringify(groups));
    }
    if (groups.length === 0) {
      return;
    }
    if (groups.length < 3) {
      message.warning('[队伍选择器]请选择完成的项目组别！');
    }
    if (!teamItem) {
      console.log('teamItem is undefined');
      return;
    }
    // 取最后的ItemGroupSexID - 即 服务端 project_group_sexId
    setCurrentItemGroupSexID(groups[2]);
    // 根据id设置 group 规则
    let rule = {
      itemName: '',
      startTime: '',
      endTime: '',
      unitMaxEnrollNumber: 0,
      unitMinEnrollNumber: 0,
      sexType: 0,
      isIncludeEnrollLimitation: false,
      scale: '',
      groupList: Array,
      minTeamNumberLimitation: 0,
      maxTeamNumberLimitation: 0,
    };
    for (let i: number = 0; i < teamItem.length; i++) {
      // 项目id相同
      if (teamItem[i].itemId === Number(groups[0])) {
        modalRef.current.setRoleType(teamItem[i].roleTypeList);
        rule.itemName = teamItem[i].name;
        rule.groupList = teamItem[i].groupData;
        const g = teamItem[i].groupData;
        for (let j: number = 0; j < g.length; j++) {
          // 组别id相同
          // 获取组别层规则
          if (g[j].groupId === Number(groups[1])) {
            rule.startTime = g[j].startTime;
            rule.endTime = g[j].endTime;
            const s = g[j].sexData;
            for (let k: number = 0; k < s.length; k++) {
              // 性别id相同
              // 获取性别层规则
              if (s[k].sexId === Number(groups[2])) {
                rule.unitMinEnrollNumber = s[k].unitMinEnrollNumber;
                rule.unitMaxEnrollNumber = s[k].unitMaxEnrollNumber;
                rule.isIncludeEnrollLimitation = s[k].isIncludeEnrollLimitation;
                rule.sexType = s[k].sex;
                rule.scale = s[k].scale;
                rule.minTeamNumberLimitation = s[k].minTeamNumberLimitation;
                rule.maxTeamNumberLimitation = s[k].maxTeamNumberLimitation;
                break;
              }
            }
            break;
          }
        }
      }
    }
    modalRef.current.setTeamRule({ ...rule, ...individualLimitation });
    openDialog(groups[2], { ...rule, ...individualLimitation });
  };

  /************************** modal ********************************/
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef<any>();
  // 关闭模态框
  const closeModal = () => {
    modalRef.current.closeModal();
    setModalVisible(false);
  };
  // 打开模态框
  const openDialog = (currentItemGroupSexID: any, rule: any) => {
    if (currentItemGroupSexID === -1) {
      // 判断当前id是否合法
      message.warn('请先进行选择项目');
      return false;
    }
    modalRef.current.setInitialState(teamEnroll, athleteList, currentItemGroupSexID, rule);
    setModalVisible(true);
  };
  // 处理队伍报名
  const onEnroll = () => {
    const reqData = modalRef.current.handleEnroll(currentItemGroupSexID);
    if (!reqData.name) {
      return;
    }
    setTableLoading(true);
    let postData = {
      ...reqData,
      matchdata: matchId,
      contestant: contestant_id,
    };
    handleTeamEnroll(postData)
      .then((res: any) => {
        if (res) {
          message.success('报名成功');
          dispatch({
            type: 'enroll/checkIsEnrollAndGetAthleteLIST',
            payload: {
              matchId: matchId,
              unitId: unitId,
              contestant_id: contestant_id,
            },
          });
          setModalVisible(false);
          modalRef.current.closeModal();
        } else {
          message.error('报名失败');
        }
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  return (
    <div>
      <EnrollHeader
        title={'团队赛报名'}
        buttonDom={
          <Cascader
            fieldNames={{ label: 'itemName', value: 'itemId', children: 'items' }}
            options={teamEnrollData}
            onChange={clickItem}
            placeholder="开设新队伍"
            className={styles.select}
          />
        }
      />
      <Table
        dataSource={teamEnroll}
        columns={showTableColumns}
        expandedRowRender={renderExpandedRow}
        rowKey={(record: any) => record.id}
        size={'small'}
        loading={loading || tableLoading}
      />
      <TeamModal
        loading={tableLoading}
        onEnroll={onEnroll}
        ref={modalRef}
        onCancel={closeModal}
        visible={modalVisible}
      />
      <div className={styles.hr} />
      <div className={styles.btn}>
        <Button
          loading={loading}
          onClick={() => {
            router.push({
              pathname: '/enroll/showEnroll/' + String(matchId),
              query: {
                teamId: String(contestant_id),
              },
            });
          }}
          type="primary"
        >
          确认报名
        </Button>
        <Button
          onClick={() => {
            router.push({
              pathname: '/enroll/individual/' + String(matchId),
              query: {
                teamId: String(contestant_id),
              },
            });
          }}
        >
          返回
        </Button>
      </div>
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
