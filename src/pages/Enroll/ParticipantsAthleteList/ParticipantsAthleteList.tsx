import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import AthleteTable from '@/pages/Enroll/ParticipantsAthleteList/components/athleteTable';
import { Button, Table } from 'antd';
import EnrollHeader from '@/pages/Enroll/components/enrollHeader';
import AthleteForm from '@/components/athleteForm/athleteForm';
import ModalForm, { AthleteFormValues } from '@/components/athleteForm/modalForm';

interface ParticipantsAthleteListProps {
  dispatch: Dispatch;
  contestant_id: number;
  loading: boolean;
  matchId?: number;
  unitId: number;
  athleteList?: Array<any>;
}

function ParticipantsAthleteList(props: ParticipantsAthleteListProps) {
  const { matchId, unitId, dispatch, athleteList, contestant_id, loading } = props;

  useEffect(() => {
    if (matchId && unitId && contestant_id) {
      dispatch({
        type: 'enroll/checkIsEnrollAndGetAthleteLIST',
        payload: { matchId, unitId, contestant_id },
      });
    }
  }, [contestant_id, matchId]);

  // TODO 异步关闭,自定义页脚,自定义位置
  const add_athlete = () => {
    setAddVisible(true);
  };

  const [addVisible, setAddVisible] = useState(false);
  const [modifyVisible, setModifyVisible] = useState(false);

  const onCancel = () => {
    if (addVisible) {
      setAddVisible(false);
    }
    if (modifyVisible) {
      setModifyVisible(false);
    }
  };

  const onCreate = (values: AthleteFormValues) => {
    console.log(values);
  };

  const modifyAthlete = (record: any) => {
    console.log(record);
    setModifyVisible(true);
  };

  if (!athleteList) {
    return <div>loading</div>;
  } else {
    return (
      <div>
        <EnrollHeader
          title={'运动员列表'}
          buttonDom={
            <Button type="primary" onClick={add_athlete}>
              添加运动员
            </Button>
          }
        />
        <AthleteTable
          matchId={matchId}
          unitId={unitId}
          contestant_id={contestant_id}
          loading={loading}
          dataSource={athleteList}
          modifyAthlete={modifyAthlete}
        />
        <ModalForm isAdd={true} onCancel={onCancel} onCreate={onCreate} visible={addVisible} />
        <ModalForm isAdd={false} onCancel={onCancel} onCreate={onCreate} visible={modifyVisible} />
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
