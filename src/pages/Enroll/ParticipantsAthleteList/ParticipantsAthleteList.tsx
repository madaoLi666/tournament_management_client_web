import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import AthleteTable from '@/pages/Enroll/ParticipantsAthleteList/components/athleteTable';
import { Table } from 'antd';

interface ParticipantsAthleteListProps {
  dispatch: Dispatch;
  contestant_id: number;
  loading: boolean;
  matchId?: number;
  unitId: number;
  athleteList?: Array<any>;
}

function ParticipantsAthleteList(props: ParticipantsAthleteListProps) {
  const {
    matchId,
    unitId,
    dispatch,
    athleteList,
    contestant_id,
    loading,
  } = props;

  useEffect(() => {
    if (matchId && unitId && contestant_id) {
      dispatch({
        type: 'enroll/checkIsEnrollAndGetAthleteLIST',
        payload: { matchId, unitId, contestant_id },
      });
    }
  }, [contestant_id, matchId]);

  if (!athleteList) {
    return <div>loading</div>;
  } else {
    return (
      <div>
        <AthleteTable
          matchId={matchId}
          unitId={unitId}
          contestant_id={contestant_id}
          loading={loading}
          dataSource={athleteList}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ enroll, loading, router }: ConnectState) => {
  const teamId = router.location.query.teamId;
  let unit = enroll.unit;

  return {
    athleteList: unit?.athleteList,
    matchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    contestantId: unit?.contestantUnitData.id,
    loading: loading.global,
    // 参赛队伍id
    contestant_id: Number(teamId),
  };
};

export default connect(mapStateToProps)(ParticipantsAthleteList);
