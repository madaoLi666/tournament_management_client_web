import React, { useEffect } from 'react';
import styles from './index.less';
import EnrollHeader from '@/pages/Enroll/components/enrollHeader';
import IndividualTable from '@/pages/Enroll/individual/components/individualTable';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';

interface IndividualProps {
  loading: boolean;
  matchId?: string;
  unitId?: number;
  dispatch: Dispatch;
  contestant_id?: number;
  enrollAthleteList: any;

  individualItemList: any;
  individualLimitation: any;
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
      <div>
        <EnrollHeader title={'个人项目报名'} />
        <IndividualTable enrollAthleteList={enrollAthleteList} loading={loading} />
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
