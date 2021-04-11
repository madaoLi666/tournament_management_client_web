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
    if (matchId && unitId && contestant_id && matchId > 0) {
      dispatch({
        type: 'enroll/checkIsEnrollAndGetAthleteLIST',
        payload: { matchId, unitId, contestant_id },
      });
    }
    return () => {};
  }, [contestant_id, matchId, unitId]);

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
            onClick={() => {
              // 这里没有限制到接受最少几个人报名
              if (String(matchId) === '26') {
                const countActive = athleteList.filter((v: any) => {
                  return v.active === 1;
                });
                if (countActive.length < 5) {
                  message.warn('不接受个人报名和人数少于5人的运动队报名，请先确认运动员参赛');
                  return;
                }
              }
              if (athleteList?.length === 0) {
                message.warn('请添加运动员后再进行报名');
                return;
              }
              if (String(matchId) === '27') {
                message.info('请在此处点击报名添加一名随队裁判！');
              }
              router.push({
                pathname: '/enroll/individual/' + String(matchId),
                query: {
                  teamId: String(contestant_id),
                },
              });
            }}
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
  };
};

export default connect(mapStateToProps)(ParticipantsAthleteList);
