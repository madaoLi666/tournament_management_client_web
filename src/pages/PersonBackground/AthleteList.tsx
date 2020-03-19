import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import { AthleteData, UnitData } from '@/models/userModel';
import AthleteListTable, { Athlete } from '@/pages/PersonBackground/components/athleteListTable';
import PageLoading from '@/pages';

interface AthleteListProps {
  id?: string;
  unitAccount?: number;
  athletes?: AthleteData[];
  unitData?: UnitData[];
  loading: boolean;
  dispatch: Dispatch;
}

function AthleteList(props: AthleteListProps) {
  const { athletes, loading, unitAccount, unitData, dispatch } = props;

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
            id: item.athlete.id,
            name: item.athlete.name,
            idcard: item.athlete.idcard,
            idcardtype: item.athlete.idcardtype,
            sex: item.athlete.sex,
            birthday: item.athlete.birthday.substr(0, 10),
            phonenumber: item.athlete.phonenumber,
            emergencyContact: item.athlete.emergencycontactpeople,
            emergencyContactPhone: item.athlete.emergencycontactpeoplephone,
            province: item.athlete.province,
            address: item.athlete.address,
            face: item.athlete.face,
            email: item.athlete.email,
          });
          return tempState;
        });
      });
    }
  }, [athletes, unitAccount, unitData]);

  if (!unitAccount || !unitData) {
    return <PageLoading />;
  } else {
    return (
      <div>
        <PageHeaderWrapper />
        <br />
        <AthleteListTable
          unitId={unitData[0].id}
          loading={loading}
          unitAccount={unitAccount}
          dataSource={data}
          dispatch={dispatch}
        />
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
