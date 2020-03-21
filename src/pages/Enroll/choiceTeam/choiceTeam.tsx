import React, { useEffect } from 'react';
import styles from './index.less';
import { Dispatch, connect } from 'dva';
import { EnrollTeamData } from '@/models/enrollModel';
import { Button, Card, Form, Input } from 'antd';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
import TeamList from '@/pages/Enroll/choiceTeam/components/teamList';
import { PlusCircleOutlined } from '@ant-design/icons/lib';
import FormBuilder from '@/components/FormBuilder/Form';
import _ from 'lodash';

interface ChoiceTeamProps {
  dispatch: Dispatch;
  loading: boolean;
  currentMatchId?: number;
  unitId: number;
  unitData: EnrollTeamData[];
  unitName: string | null | undefined;
  gameList: any;
}

function ChoiceTeam(props: ChoiceTeamProps) {
  const { loading, currentMatchId, unitName, unitId, unitData, dispatch, gameList } = props;

  useEffect(() => {
    if (currentMatchId === undefined || currentMatchId === -1) {
      return;
    }
    dispatch({
      type: 'enroll/getContestantUnitData',
      payload: { matchId: currentMatchId, unitId: unitId },
    });
  }, [currentMatchId, unitId]);

  /********************* 添加新队伍时触发的事件 ********************/
  const addTeam = () => {
    router.push({
      pathname: '/enroll/editUnitInfo/' + String(currentMatchId),
      query: {
        teamId: '0',
      },
    });
  };

  return (
    <div className={styles.listCard}>
      <Card className={styles.content} bordered={false} title={<strong>单位：{unitName}</strong>}>
        <Button
          loading={loading}
          type="dashed"
          onClick={addTeam}
          className={styles.btn}
          icon={<PlusCircleOutlined />}
        >
          添加新队伍
        </Button>
        <TeamList loading={loading} currentMatchId={currentMatchId} unitData={unitData} />
      </Card>
      <div className={styles.editButton}>
        <Button
          onClick={() => {
            for (let match of gameList) {
              if (match.id == currentMatchId) {
                router.push(`/home/introduction?name=${match.name}`);
              }
            }
          }}
        >
          返回
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = ({ loading, enroll, unit, gameList }: ConnectState) => {
  let unitData: any = [];
  if (enroll.unit) {
    unitData = enroll.unit.unitData;
  }

  return {
    loading: loading.global,
    currentMatchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    unitData,
    unitName: unit.mainpart,
    gameList: gameList.gameList,
  };
};

export default connect(mapStateToProps)(ChoiceTeam);
