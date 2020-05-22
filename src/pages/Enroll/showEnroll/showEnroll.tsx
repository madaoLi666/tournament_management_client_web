import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import { ContestantUnitData } from '@/models/enrollModel';
import { personProject, teamProject, unitInfo } from '@/pages/Enroll/showEnroll/components/data';
import { getArray, getArray1, getManNumber } from '@/pages/Enroll/showEnroll/components/dataDeal';
import { sendEmail } from '@/services/enrollServices';
import router from 'umi/router';
import { Layout, PageHeader, Descriptions, Table, Comment, Button, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import styles from './index.less';

const { Header, Content, Footer } = Layout;

interface ShowEnrollProps {
  current_match_id?: number | undefined;
  unit_info?: any;
  game_list?: Array<any>;
  dispatch: Dispatch;
  contestant?: any;
  athleteList?: any;
  teamList?: Array<any>;
  loading: boolean;
  contestantUnitData?: ContestantUnitData;
  contestant_id: number;
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
  } = props;

  const [game_name, setGame_name] = useState('');
  useEffect(() => {
    if (game_list && game_list.length !== 0) {
      for (let i = 0; i < game_list.length; i++) {
        if (current_match_id === game_list[i].id) {
          setGame_name(game_list[i].name);
        }
      }
    }
  }, [current_match_id, game_list]);

  // 获取信息 调用 checkIsEnroll接口
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
    if (athleteList === undefined || athleteList.length === 0) {
      return;
    }
    // 筛选出选中的先
    let person_athlete_list: Array<any> = athleteList.filter((v: any) => v.active == 1);
    person_athlete_list = person_athlete_list.filter(
      (v: any) => v.project.personaldata.length + v.project.upgrouppersonaldata.length !== 0,
    );
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

  // 页头主体
  const renderContent = (column = 2) => (
    <div>
      <Descriptions size="middle" column={column}>
        <Descriptions.Item label="领队">{unitInfo.unit_leader}</Descriptions.Item>
        <Descriptions.Item label="领队电话">{unitInfo.leader_phone}</Descriptions.Item>
        <Descriptions.Item label="领队邮箱">{unitInfo.leader_email}</Descriptions.Item>
      </Descriptions>
      {unitInfo.coach1 === '' ? null : (
        <Descriptions size="middle" column={2}>
          <Descriptions.Item label="教练">{unitInfo.coach1}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{unitInfo.coach1_phone}</Descriptions.Item>
        </Descriptions>
      )}
      {unitInfo.coach2 === '' ? null : (
        <Descriptions size="middle" column={2}>
          <Descriptions.Item label="教练">{unitInfo.coach2}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{unitInfo.coach2_phone}</Descriptions.Item>
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

  // 表格Columns
  const personColumns: ColumnProps<personProject>[] = [
    { key: 'name', dataIndex: 'name', title: '姓名', align: 'center' },
    { key: 'id_card', dataIndex: 'id_card', title: '证件号', align: 'center' },
    { key: 'sex', dataIndex: 'sex', title: '性别', align: 'center' },
    { key: 'birthday', dataIndex: 'birthday', title: '出生日期', align: 'center' },
    { key: 'enroll_group', dataIndex: 'enroll_group', title: '填报组别', align: 'center' },
    { key: 'enroll_project', dataIndex: 'enroll_project', title: '填报项目', align: 'center' },
    // {key: 'operation', title: '操作',align:'center'}
  ];
  const teamColumns: ColumnProps<teamProject>[] = [
    { key: 'project_name', dataIndex: 'project_name', title: '参赛项目', align: 'center' },
    { key: 'enroll_group', dataIndex: 'enroll_group', title: '填报组别', align: 'center' },
    { key: 'team_name', dataIndex: 'team_name', title: '参赛队伍名称（队名）', align: 'center' },
    { key: 'team_member', dataIndex: 'team_member', title: '队员名单', align: 'center' },
    { key: 'man', dataIndex: 'man', title: '男', align: 'center' },
    { key: 'woman', dataIndex: 'woman', title: '女', align: 'center' },
  ];

  return (
    <Layout className={styles['newLayout']}>
      <Comment
        author={<a style={{ fontSize: 12, color: '#f5222d' }}>尊敬的领队您好：</a>}
        content={
          <p style={{ color: '#f5222d' }}>
            本赛事组委会已收到贵单位提交的报名信息，请认真确认下列全部信息。
            确认无误后，请点击提交本《确认书》至赛事组委会，同时以此表明贵单位已清楚明白对本场赛事所有信息的责任和权利。
          </p>
        }
      />
      <div className={styles.hr} />
      <Content className={styles['show-enroll-content']}>
        <div>
          <PageHeader
            title={'单位：' + unitInfo.unit_name}
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
            <strong>个人项目报名</strong>
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
            <strong>团体项目报名</strong>
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
        >
          提交本《确认书》
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
          返回
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
    // 队伍id
    contestant_id: Number(teamId),
  };
};

export default connect(mapStateToProps)(ShowEnroll);
