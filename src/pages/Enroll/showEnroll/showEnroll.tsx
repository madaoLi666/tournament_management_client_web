import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import { ContestantUnitData, TeamEnrollLimitation } from '@/models/enrollModel';
import { personProject, teamProject, unitInfo } from '@/pages/Enroll/showEnroll/components/data';
import { getArray, getArray1, getManNumber } from '@/pages/Enroll/showEnroll/components/dataDeal';
import { sendEmail } from '@/services/enrollServices';
import router from 'umi/router';
import { Layout, PageHeader, Descriptions, Table, Comment, Button, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { throttle } from '@/utils/index'
import styles from './index.less';

const { Header, Content, Footer } = Layout;

interface ShowEnrollProps {
  current_match_id?: number | undefined,
  unit_info?: any,
  game_list?: Array<any>,
  dispatch: Dispatch,
  contestant?: any,
  athleteList?: any,
  teamList?: Array<any>,
  loading: boolean,
  contestantUnitData?: ContestantUnitData,
  contestant_id: number,
  teamEnrollLimitation: TeamEnrollLimitation | null
}

function ShowEnroll(props: ShowEnrollProps) {
  const {
    contestant_id,
    athleteList,
    contestant,
    contestantUnitData,
    current_match_id,
    dispatch,
    game_list,
    loading,
    teamList,
    unit_info,
    teamEnrollLimitation
  } = props;

  const [game_name, setGame_name] = useState('');

  // enroll number
  const [enrollNumber, setEnrollNumber] = useState<number>(0)
  useEffect(() => {
    // throttle, because the props change will make a new dispatch, althought dva has help us to debounce
    if(!teamEnrollLimitation && Number(current_match_id) > 0){
      (throttle(() => {
        dispatch({
          type: 'enroll/getTeamLimitation',
          payload: { matchdata: Number(current_match_id) }
        })
      }, 500))()
    }
  }, [current_match_id])


  useEffect(() => {
    if (game_list && game_list.length !== 0) {
      for (let i = 0; i < game_list.length; i++) {
        if (current_match_id === game_list[i].id) {
          setGame_name(game_list[i].name);
        }
      }
    }
  }, [current_match_id, game_list]);

  // ???????????? ?????? checkIsEnroll??????
  useEffect(() => {
    if (unit_info.id === undefined) {
      return;
    }
    dispatch({
      type: 'enroll/checkIsEnrollAndGetAthleteLIST',
      payload: {
        matchId: current_match_id,
        unitId: unit_info.id,
        contestant_id,
      },
    });
  }, [unit_info, current_match_id]);

  const [unitInfo, setUnit_info] = useState<unitInfo>({
    unit_name: '',
    unit_leader: '',
    leader_phone: '',
    leader_email: '',
    coach1: '',
    coach1_phone: '',
    coach2: '',
    coach2_phone: '',
  });
  useEffect(() => {
    const { contestant } = props;
    if (contestant.id === undefined) {
      return;
    }
    setUnit_info({
      unit_name: contestant.name,
      unit_leader: contestant.leader,
      leader_phone: contestant.leaderphonenumber,
      leader_email: contestant.email,
      coach1: contestant.coachone,
      coach2: contestant.coachtwo,
      coach1_phone: contestant.coachonephonenumber,
      coach2_phone: contestant.coachtwophonenumber,
    });
  }, [contestant]);

  const [athlete_list, setAthlete_list] = useState<personProject[]>();
  useEffect(() => {
    const { athleteList } = props;
    // ????????????????????????
    let enrollCount = 0;
    if (athleteList === undefined || athleteList.length === 0) {
      return;
    }
    // ?????????????????????
    let person_athlete_list: Array<any> = athleteList.filter((v: any) => v.active == 1);
    person_athlete_list = person_athlete_list.filter((v: any) => {
      if(v.project.personaldata.length + v.project.upgrouppersonaldata.length + v.project.teamproject.length !== 0){
        enrollCount++;
      }
      return v.project.personaldata.length + v.project.upgrouppersonaldata.length !== 0;
    });
    let temp_list = new Array<personProject>();
    for (let i = 0; i < person_athlete_list.length; i++) {
      let temp_athlete: personProject = {
        name: person_athlete_list[i].athlete.name,
        id_card: person_athlete_list[i].athlete.idcard,
        sex: person_athlete_list[i].athlete.sex,
        birthday: person_athlete_list[i].athlete.birthday.substr(0, 10),
        enroll_group: person_athlete_list[i].groupage,
        enroll_project:
          getArray(person_athlete_list[i].project.personaldata) +
          getArray(person_athlete_list[i].project.upgrouppersonaldata),
        key: person_athlete_list[i].athlete.id,
      };
      temp_list.push(temp_athlete);
    }
    setAthlete_list(temp_list);
    setEnrollNumber(enrollCount);
  }, [athleteList]);

  const [team_list, setTeam_list] = useState<teamProject[]>();
  useEffect(() => {
    const { teamList } = props;
    if (!teamList || teamList.length === 0) {
      setTeam_list([]);
      return;
    }
    let temp_list = new Array<teamProject>();
    for (let i = 0; i < teamList.length; i++) {
      let project_group_names: string[];
      let man_member = getManNumber(teamList[i].member);
      project_group_names = teamList[i].itemGroupSexName.split('-', 3);
      let temp_team: teamProject = {
        project_name: project_group_names[0],
        enroll_group: project_group_names[1],
        team_name: teamList[i].teamName,
        team_member: getArray1(teamList[i].member),
        key: i.toString(),
        man: man_member,
        woman: teamList[i].member.length - man_member,
      };
      temp_list.push(temp_team);
    }
    setTeam_list(temp_list);
  }, [teamList]);

  function send_email() {
    // @ts-ignore
    const { id } = contestantUnitData;
    if (id === undefined) {
      return;
    }
    sendEmail({
      contestant_id: id,
    });
    router.push('/enroll/success');
  }

  // ????????????
  const renderContent = (column = 2) => (
    <div>
      <Descriptions size="middle" column={column}>
        <Descriptions.Item label="??????">{unitInfo.unit_leader}</Descriptions.Item>
        <Descriptions.Item label="????????????">{unitInfo.leader_phone}</Descriptions.Item>
        <Descriptions.Item label="????????????">{unitInfo.leader_email}</Descriptions.Item>
      </Descriptions>
      {unitInfo.coach1 === '' ? null : (
        <Descriptions size="middle" column={2}>
          <Descriptions.Item label="??????">{unitInfo.coach1}</Descriptions.Item>
          <Descriptions.Item label="????????????">{unitInfo.coach1_phone}</Descriptions.Item>
        </Descriptions>
      )}
      {unitInfo.coach2 === '' ? null : (
        <Descriptions size="middle" column={2}>
          <Descriptions.Item label="??????">{unitInfo.coach2}</Descriptions.Item>
          <Descriptions.Item label="????????????">{unitInfo.coach2_phone}</Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );

  const PageContent = ({ children }: any) => {
    return (
      <div className="content">
        <div className="main">{children}</div>
      </div>
    );
  };

  // ??????Columns
  const personColumns: ColumnProps<personProject>[] = [
    { key: 'name', dataIndex: 'name', title: '??????', align: 'center' },
    { key: 'id_card', dataIndex: 'id_card', title: '?????????', align: 'center' },
    { key: 'sex', dataIndex: 'sex', title: '??????', align: 'center' },
    { key: 'birthday', dataIndex: 'birthday', title: '????????????', align: 'center' },
    { key: 'enroll_group', dataIndex: 'enroll_group', title: '????????????', align: 'center' },
    { key: 'enroll_project', dataIndex: 'enroll_project', title: '????????????', align: 'center' },
    // {key: 'operation', title: '??????',align:'center'}
  ];
  const teamColumns: ColumnProps<teamProject>[] = [
    { key: 'project_name', dataIndex: 'project_name', title: '????????????', align: 'center' },
    { key: 'enroll_group', dataIndex: 'enroll_group', title: '????????????', align: 'center' },
    { key: 'team_name', dataIndex: 'team_name', title: '??????????????????????????????', align: 'center' },
    { key: 'team_member', dataIndex: 'team_member', title: '????????????', align: 'center' },
    { key: 'man', dataIndex: 'man', title: '???', align: 'center' },
    { key: 'woman', dataIndex: 'woman', title: '???', align: 'center' },
  ];

  const leastnumber = teamEnrollLimitation?.leastnumber || 0;
  const mostnumber = teamEnrollLimitation?.mostnumber || 999;
  const confirmBtnDisable = enrollNumber < leastnumber || enrollNumber > mostnumber;

  return (
    <Layout className={styles['newLayout']}>
      <Comment
        author={<a style={{ fontSize: 12, color: '#f5222d' }}>????????????????????????</a>}
        content={
          <p style={{ color: '#f5222d' }}>
            ????????????????????????????????????????????????????????????????????????????????????????????????
            ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
          </p>
        }
      />
      <div className={styles.hr} />
      <Content className={styles['show-enroll-content']}>
        <div>
          <PageHeader
            title={'?????????' + unitInfo.unit_name}
            onBack={() => {
              router.goBack();
            }}
          >
            <PageContent>{renderContent()}</PageContent>
          </PageHeader>
        </div>
        <div className={styles.hr} />

        <div className={styles['show-person']}>
          <p>
            <strong>??????????????????</strong>
          </p>
          <Table
            loading={props.loading}
            bordered={true}
            scroll={{ x: 800 }}
            columns={personColumns}
            dataSource={athlete_list}
            rowKey={(record: any) => record.key}
          />
        </div>
        <div className={styles.hr} />

        <div className={styles['show-team']}>
          <p>
            <strong>??????????????????</strong>
          </p>
          <Table
            loading={props.loading}
            bordered={true}
            scroll={{ x: 850 }}
            columns={teamColumns}
            dataSource={team_list}
            rowKey={(record: any) => record.key}
          />
        </div>
      </Content>
      <div className={styles.hr} />
      {confirmBtnDisable && (
        <div className={styles.errorText}>
          {`????????????????????????${enrollNumber}????????????????????????????????????${leastnumber}????????????${mostnumber}??????????????????`}
        </div>
      )}
      <div className={styles.btn}>
        <Button
          loading={loading}
          onClick={() => {
            send_email();
            router.push({
              pathname: '/enroll/success/' + String(current_match_id),
              query: {
                teamId: String(contestant_id),
              },
            });
          }}
          type="primary"
          disabled={confirmBtnDisable}
        >
          ????????????????????????
        </Button>
        <Button
          onClick={() => {
            router.push({
              pathname: '/enroll/team/' + String(current_match_id),
              query: {
                teamId: String(contestant_id),
              },
            });
          }}
        >
          ??????
        </Button>
      </div>
    </Layout>
  );
}

const mapStateToProps = ({ router, enroll, loading, gameList }: ConnectState) => {
  const teamId = router.location.query.teamId;
  const { unit } = enroll;
  return {
    current_match_id: enroll.currentMatchId,
    unit_info: enroll.unitInfo,
    game_list: gameList.gameList,
    contestant: enroll.unit?.contestantUnitData,
    athleteList: enroll.unit?.athleteList,
    teamList: enroll.unit?.teamEnrollList,
    loading: loading.global,
    contestantUnitData: unit?.contestantUnitData,
    // ??????id
    contestant_id: Number(teamId),
    teamEnrollLimitation: enroll.teamEnrollLimitation
  };
};

export default connect(mapStateToProps)(ShowEnroll);
