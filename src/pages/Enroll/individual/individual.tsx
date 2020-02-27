import React, { useEffect } from 'react';
import styles from './index.less';
import EnrollHeader from '@/pages/Enroll/components/enrollHeader';
import IndividualTable from '@/pages/Enroll/individual/components/individualTable';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import { Button, message } from 'antd';
import { router } from 'umi';

interface IndividualProps {
  loading: boolean;
  matchId?: string;
  unitId?: number;
  dispatch: Dispatch;
  contestant_id?: number;
  enrollAthleteList: any;
  individualItemList: any;
  individualLimitation: any;
  group_age_list: any;
}

function Individual(props: IndividualProps) {
  const {
    loading,
    matchId,
    unitId,
    dispatch,
    contestant_id,
    enrollAthleteList,
    individualItemList,
    individualLimitation,
    group_age_list,
  } = props;

  useEffect(() => {
    if (matchId && unitId) {
      dispatch({
        type: 'enroll/checkIsEnrollAndGetAthleteLIST',
        payload: { matchId, unitId, contestant_id },
      });
    }
  }, [matchId, unitId, contestant_id]);

  if (!enrollAthleteList) {
    return <div>loading</div>;
  } else {
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <EnrollHeader title={'个人项目报名'} />
          <IndividualTable
            individualItemList={individualItemList}
            individualLimitation={individualLimitation}
            enrollAthleteList={enrollAthleteList}
            loading={loading}
            group_age_list={group_age_list}
            matchId={matchId}
            unitId={unitId}
            contestant_id={contestant_id}
            dispatch={dispatch}
          />
        </div>
        <div className={styles.hr} />
        <div className={styles.btn}>
          <Button
            loading={loading}
            onClick={() => {
              router.push({
                pathname: '/enroll/team/' + String(matchId),
                query: {
                  teamId: String(contestant_id),
                },
              });
            }}
            type="primary"
          >
            进入团队赛报名
          </Button>
          <Button
            onClick={() => {
              router.push({
                pathname: '/enroll/participants/' + String(matchId),
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
}

const mapStateToProps = ({ router, enroll, user, loading, gameList }: ConnectState) => {
  const teamId = router.location.query.teamId;
  return {
    enrollAthleteList: enroll.unit?.athleteList.filter((v: any) => {
      return v.active === 1;
    }),
    matchId: String(enroll.currentMatchId),
    unitId: enroll.unitInfo.id,
    individualItemList: enroll.individualItem,
    individualLimitation: enroll.individualLimitation,
    unit_account: user.unitAccount,
    person_data: user.athleteData?.length ? user.athleteData[0] : undefined,
    loading: loading.global,
    group_age_list: gameList.group_age,
    contestant_id: Number(teamId),
  };
};

export default connect(mapStateToProps)(Individual);
