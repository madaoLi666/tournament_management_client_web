import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import AthleteTable from '@/pages/Enroll/ParticipantsAthleteList/components/athleteTable';
import { Button, message } from 'antd';
import EnrollHeader from '@/pages/Enroll/components/enrollHeader';
import ModalForm, { AthleteFormValues } from '@/components/athleteForm/modalForm';
import { newUnitAthlete } from '@/services/enrollServices';
import { router } from 'umi';
import { throttle } from '@/utils/index';
import { TeamEnrollLimitation } from '@/models/enrollModel';
interface ParticipantsAthleteListProps {
  dispatch: Dispatch,
  contestant_id: number,
  loading: boolean,
  matchId?: number,
  unitId: number,
  athleteList?: Array<any>,
  teamEnrollLimitation: TeamEnrollLimitation | null
}

function ParticipantsAthleteList(props: ParticipantsAthleteListProps) {
  const { matchId, unitId, dispatch, athleteList, contestant_id, loading, teamEnrollLimitation } = props;

  useEffect(() => {
    if (matchId && unitId && contestant_id && matchId > 0) {
      dispatch({
        type: 'enroll/checkIsEnrollAndGetAthleteLIST',
        payload: { matchId, unitId, contestant_id },
      });
    }
    return () => {};
  }, [contestant_id, matchId, unitId]);

  useEffect(() => {
    // throttle, because the props change will make a new dispatch, althought dva has help us to debounce
    if(!teamEnrollLimitation && Number(matchId) > 0){
      (throttle(() => {
        dispatch({
          type: 'enroll/getTeamLimitation',
          payload: { matchdata: Number(matchId) }
        })
      }, 500))()
    }
  }, [matchId])

  const add_athlete = () => {
    setAddVisible(true);
  };

  /***************** modal **********************/
  const [addVisible, setAddVisible] = useState(false);
  const [confirmLoading, setLoading] = useState(false);

  const onCancel = () => {
    if (addVisible) {
      setAddVisible(false);
    }
  };

  // 提交表单的事件
  const onCreate = (values: AthleteFormValues) => {
    // 如果这次有上传图片，否则传个空字符串
    if (values.uploadPic) {
      emitData({ image: values.uploadPic[0], ...values });
    } else {
      emitData({ image: '', ...values });
    }
  };

  const emitData = (data: AthleteFormValues) => {
    setLoading(true);
    let formData = new FormData();
    if (
      data.residence !== undefined &&
      data.residence.hasOwnProperty('city') &&
      data.residence.hasOwnProperty('address')
    ) {
      formData.append(
        'province',
        data.residence.city !== undefined ? data.residence.city.join('-') : '',
      );
      formData.append(
        'address',
        data.residence.address !== undefined ? data.residence.address : '',
      );
    } else {
      formData.append('province', '');
      formData.append('address', '');
    }
    formData.append('idcard', data.identifyNumber);
    formData.append('name', data.name);
    formData.append('idcardtype', data.idCardType);
    formData.append('sex', data.sex);
    formData.append('birthday', data.birthday.format('YYYY-MM-DD hh:mm:ss'));
    formData.append('phonenumber', data.phone !== undefined ? data.phone : '');
    formData.append('email', data.email !== undefined ? data.email : '');
    formData.append('face', data.image.originFileObj !== undefined ? data.image.originFileObj : '');
    formData.append('unitdata', unitId.toString());
    // 添加运动员
    newUnitAthlete(formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(data => {
        if (data) {
          // 没有重新渲染
          dispatch({
            type: 'enroll/checkIsEnrollAndGetAthleteLIST',
            payload: { unitId, matchId, contestant_id },
          });
          message.success('注册成功');
        }
        setAddVisible(false);
        setLoading(false);
      })
      .catch(res => {
        setLoading(false);
      });
  };

  const handleButtonClick = () => {
    if(!athleteList || !athleteList.length) {
      message.warn('请添加运动员后再进行报名');
      return;
    }
    const countActive: Array<any>|undefined = athleteList?.filter((v: any) => {
      return v.active === 1;
    });
    const { leastnumber, mostnumber } = teamEnrollLimitation;
    if(countActive) {
      if (countActive.length < leastnumber || countActive.length > mostnumber) {
        message.warn(`参数运动员最少为${leastnumber}人，最多为${mostnumber}`);
        return;
      }
    }
    router.push({
      pathname: '/enroll/individual/' + String(matchId),
      query: {
        teamId: String(contestant_id),
      },
    });
  };

  if (!athleteList) {
    return <div>loading</div>;
  } else {
    return (
      <div className={styles.main}>
        <div className={styles.content}>
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
          />
          <ModalForm
            title={'新增运动员'}
            initialValue={null}
            isAdd={true}
            onCancel={onCancel}
            onCreate={onCreate}
            visible={addVisible}
            loading={confirmLoading}
          />
        </div>

        <div className={styles.hr} />
        <div className={styles.btn}>
          <Button
            loading={loading}
            onClick={handleButtonClick}
            type="primary"
          >
            进入个人赛报名
          </Button>
          <Button
            onClick={() => {
              router.push({
                pathname: '/enroll/editUnitInfo/' + String(matchId),
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
    teamEnrollLimitation: enroll?.teamEnrollLimitation
  };
};

export default connect(mapStateToProps)(ParticipantsAthleteList);
