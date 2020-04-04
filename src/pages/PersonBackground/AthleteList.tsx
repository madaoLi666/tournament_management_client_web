import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import { AthleteData, UnitData } from '@/models/userModel';
import AthleteListTable, { Athlete } from '@/pages/PersonBackground/components/athleteListTable';
import PageLoading from '@/pages';

interface AthleteListProps {
  id?: number;
  unitAccount?: number;
  athletes?: any[];
  unitData?: UnitData[];
  loading: boolean;
  dispatch: Dispatch;
}

function AthleteList(props: AthleteListProps) {
  const { athletes, loading, unitAccount, unitData, dispatch } = props;

  if (!unitAccount || !unitData || !athletes) {
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
          dataSource={athletes}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ user, loading }: ConnectState) => {
  const unitAccount = user.unitAccount;
  const unitData = user.unitData;
  const athletes = user.athleteData;
  let dataSource: any[] = [];

  if (!unitData || !unitAccount || !athletes) {
    return {
      id: user.id,
      unitAccount,
      athletes: undefined,
      unitData: undefined,
      loading: loading.global,
    };
  }
  if (unitAccount === 1) {
    athletes.forEach((item, index) => {
      dataSource.push({
        key: (index + 1).toString(),
        name: item.name,
        identifyID: item.idcard,
        sex: item.sex,
        birthday: item.birthday.substr(0, 10),
        phone: item.phonenumber,
        emergencyContact: item.emergencycontactpeople,
        emergencyContactPhone: item.emergencycontactpeoplephone,
      });
    });
    // 是单位账号
  } else if (unitData.length !== 0 && unitData[0].unitathlete) {
    unitData[0].unitathlete.forEach((item, index) => {
      dataSource.push({
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
        unitdata_id: item.unitdata_id,
        unitathlete_id: item.unitathlete_id,
      });
    });
  }

  return {
    id: user.id,
    unitAccount,
    athletes: dataSource,
    unitData,
    loading: loading.global,
  };
};

export default connect(mapStateToProps)(AthleteList);
