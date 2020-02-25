import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import UnitForm from '@/pages/Enroll/unitInfo/components/unitForm';
import { router } from 'umi';
import { message } from 'antd';
import { EnrollTeamData } from '@/models/enrollModel';
import { participativeUnit } from '@/services/enrollServices';
import EnrollHeader from '@/pages/Enroll/components/enrollHeader';

interface UnitInfoProps {
  dispatch: Dispatch;
  currentTeamId: number;
  matchId?: number;
  initialValue: any;
  loading: boolean;
}

function UnitInfo(props: UnitInfoProps) {
  const { currentTeamId, matchId, initialValue, dispatch, loading } = props;
  const [formLoading, setFormLoading] = useState(false);

  const submitData = (data: any) => {
    if (initialValue && matchId) {
      setFormLoading(true);
      // 数据装载
      let formData = new FormData();
      formData.append('unitdata', initialValue.unitId);
      formData.append('matchdata', matchId.toString());
      formData.append('contestant_id', currentTeamId.toString());
      formData.append(
        'name',
        data.unitNameAlias === undefined ? '' : data.unitNameAlias,
      );
      formData.append('leader', data.leaderName);
      formData.append('leaderphonenumber', data.leaderPhone);
      formData.append('email', data.leaderEmail);
      formData.append(
        'coachone',
        data.coach1Name === undefined ? '' : data.coach1Name,
      );
      formData.append(
        'coachonephonenumber',
        data.coach1Phone === undefined ? '' : data.coach1Phone,
      );
      formData.append(
        'coachtwo',
        data.coach2Name === undefined ? '' : data.coach2Name,
      );
      formData.append(
        'coachtwophonenumber',
        data.coach2Phone === undefined ? '' : data.coach2Phone,
      );
      formData.append('dutybook', data.guaranteePic);
      participativeUnit(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(async data => {
        // 判断请求状况
        if (data) {
          let uD = {
            id: data.id,
            leaderName: data.leader,
            leaderPhone: data.leaderphonenumber,
            leaderEmail: data.email,
            coach1Name: data.coachone,
            coach1Phone: data.coachonephonenumber,
            coach2Name: data.coachtwo,
            coach2Phone: data.coachtwophonenumber,
            guaranteePic: data.dutybook,
          };
          // 修改unitData
          dispatch({
            type: 'enroll/modifyUnitData',
            payload: { unitData: uD },
          });
          router.push({
            pathname: '/enroll/participants/' + String(matchId),
            query: {
              teamId: String(uD.id),
            },
          });
        }
        setFormLoading(false);
      });
    }
  };

  useEffect(() => {
    if (currentTeamId !== undefined && currentTeamId !== null) {
      dispatch({
        type: 'enroll/getContestantUnitData',
        payload: { matchId: matchId, unitId: initialValue.unitId },
      });
    } else {
      message.warning('请选择参赛队伍');
      router.push('/enroll/choiceTeam');
    }
  }, [currentTeamId, matchId, initialValue.unitId]);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div>
        <EnrollHeader title={'报名信息'} />
        <UnitForm
          matchId={String(matchId)}
          loading={formLoading}
          submitForm={submitData}
          initialValue={initialValue}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ router, enroll, loading }: ConnectState) => {
  const teamId = router.location.query.teamId;
  const { unit, unitInfo } = enroll;
  // 单位名称
  const { unitName } = unitInfo;

  let initialValue: any = {
    unitName,
    unitId: unitInfo.id,
    // 这个unitNameAlias是队伍名称，因为之前不是安装队伍来报名的，所以名字有错
    unitNameAlias: '',
    leaderName: '',
    leaderPhone: '',
    leaderEmail: '',
    coach1Name: '',
    coach1Phone: '',
    coach2Name: '',
    coach2Phone: '',
    guaranteePic: null,
  };

  if (unit?.unitData) {
    const unitData = unit.unitData;
    for (let i = 0; i < unitData.length; i++) {
      if (unitData[i].id === Number(teamId)) {
        initialValue.unitNameAlias = unitData[i].name;
        initialValue.leaderName = unitData[i].leader;
        initialValue.leaderPhone = unitData[i].leaderphonenumber;
        initialValue.leaderEmail = unitData[i].email;
        initialValue.coach1Name = unitData[i].coachone;
        initialValue.coach1Phone = unitData[i].coachonephonenumber;
        initialValue.coach2Name = unitData[i].coachtwo;
        initialValue.coach2Phone = unitData[i].coachtwophonenumber;
        initialValue.guaranteePic =
          unitData[i].url_dutybook === '' ? null : unitData[i].url_dutybook;
        break;
      }
    }
  }

  return {
    initialValue: initialValue,
    matchId: enroll.currentMatchId,
    currentTeamId: Number(teamId),
    loading: loading.global,
  };
};

export default connect(mapStateToProps)(UnitInfo);
