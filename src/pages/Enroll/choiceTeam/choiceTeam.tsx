import React, { useEffect } from 'react';
import styles from './index.less';
import { Dispatch, connect } from 'dva';
import { EnrollTeamData } from '@/models/enrollModel';
import { Avatar, Button, Card, Input, List, Radio, Badge } from 'antd';
import { ConnectState } from '@/models/connect';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

interface ChoiceTeamProps {
  dispatch: Dispatch;
  loading: boolean;
  currentMatchId?: number;
  unitId: number;
  unitData: EnrollTeamData[];
  unitName: string | null | undefined;
}

function ChoiceTeam(props: ChoiceTeamProps) {
  const {
    loading,
    currentMatchId,
    unitName,
    unitId,
    unitData,
    dispatch,
  } = props;

  useEffect(() => {
    console.log(props);
  }, [props]);

  return <div>123</div>;
}

const mapStateToProps = ({ loading, enroll, unit }: ConnectState) => {
  let unitData: any;
  if (enroll.unit) {
    unitData = enroll.unit.unitData;
  }

  return {
    loading: loading.global,
    currentMatchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    unitData,
    unitName: unit.mainpart,
  };
};

export default connect(mapStateToProps)(ChoiceTeam);
