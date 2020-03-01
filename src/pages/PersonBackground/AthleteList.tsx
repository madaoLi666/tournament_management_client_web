import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { AthleteData, UnitData } from '@/models/userModel';
import AthleteListTable, { Athlete } from '@/pages/PersonBackground/components/athleteListTable';
import PageLoading from '@/pages';

interface AthleteListProps {
  id?: string;
  unitAccount?: number;
  athletes?: AthleteData[];
  unitData?: UnitData[];
  loading: boolean;
}

function AthleteList(props: AthleteListProps) {
  const { id, athletes, loading, unitAccount, unitData } = props;

  // 表格dataSource
  const [data, setData] = useState<Athlete[]>([]);

  useEffect(() => {
    if (!unitData || !unitAccount || !athletes) {
      return;
    }
    if (unitAccount === 1) {
      athletes.forEach((item, index) => {
        setData((prevState: any) => {
          let tempState = Object.assign([], prevState);
          tempState.push({
            key: (index + 1).toString(),
            name: item.name,
            identifyID: item.idcard,
            sex: item.sex,
            birthday: item.birthday.substr(0, 10),
            phone: item.phonenumber,
            emergencyContact: item.emergencycontactpeople,
            emergencyContactPhone: item.emergencycontactpeoplephone,
          });
          return tempState;
        });
      });
      // 是单位账号
    } else if (unitData.length !== 0 && unitData[0].unitathlete) {
      unitData[0].unitathlete.forEach((item, index) => {
        setData((prevState: any) => {
          let tempState = Object.assign([], prevState);
          tempState.push({
            key: (index + 1).toString(),
            name: item.athlete.name,
            identifyID: item.athlete.idcard,
            sex: item.athlete.sex,
            birthday: item.athlete.birthday.substr(0, 10),
            phone: item.athlete.phonenumber,
            emergencyContact: item.athlete.emergencycontactpeople,
            emergencyContactPhone: item.athlete.emergencycontactpeoplephone,
          });
          return tempState;
        });
      });
    }
  }, [unitAccount, unitData]);

  if (!unitAccount || !unitData) {
    return <PageLoading />;
  } else {
    return (
      <div>
        <PageHeaderWrapper />
        <AthleteListTable loading={loading} unitAccount={unitAccount} dataSource={data} />
      </div>
    );
  }
}

const mapStateToProps = ({ user, loading }: ConnectState) => {
  return {
    id: user.id,
    unitAccount: user.unitAccount,
    athletes: user.athleteData,
    unitData: user.unitData,
    loading: loading.global,
  };
};

export default connect(mapStateToProps)(AthleteList);
