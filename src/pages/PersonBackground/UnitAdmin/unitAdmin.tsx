import React, { useEffect } from 'react';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import BaseMessage from '@/pages/PersonBackground/UnitAdmin/components/baseMessage';
import MainPartMessage from '@/pages/PersonBackground/UnitAdmin/components/mainpartMessage';

/* 单位名称 单位联系人	单位联系人电话 邮箱 邮政编码 省份 地址 */
export interface CurrentAccount {
  unitdata_id: number;
  name: string;
  contactperson: string;
  contactphone: string;
  email: string;
  postalcode: string;
  province: string;
  address: string;
  residence?: {
    city: Array<string>;
    address: string;
  };
}

interface UnitAdminProps {
  currentAccount: CurrentAccount;
  unitdata_id: number;
  businesslicense: string | null;
  mainpart: string;
  dispatch: Dispatch;
  loading?: boolean;
}

function UnitAdmin(props: UnitAdminProps) {
  const { dispatch, businesslicense, currentAccount, mainpart, unitdata_id, loading } = props;

  if (!mainpart || !businesslicense || !unitdata_id || !currentAccount) {
    return <div>loading</div>;
  } else {
    return (
      <div>
        <PageHeaderWrapper />
        <div className={styles.back}>
          <span>基本信息</span>
          <BaseMessage
            currentAccount={currentAccount}
            unitdata_id={unitdata_id}
            currentAccountName={currentAccount.name}
          />
        </div>
        <div className={styles.back}>
          <span>营业执照信息</span>
          <MainPartMessage
            loading={loading}
            unitdata_id={unitdata_id}
            businesslicense={businesslicense}
            current_main_part={mainpart}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ user, unit, loading }: ConnectState) => {
  const { unitData } = user;
  const { businesslicense, mainpart } = unit;
  if (unitData && unitData.length !== 0 && unitData[0].id !== undefined) {
    return {
      currentAccount: {
        unitdata_id: unitData[0].id,
        name: unitData[0].name,
        contactperson: unitData[0].contactperson,
        contactphone: unitData[0].contactphone,
        email: unitData[0].email,
        postalcode: unitData[0].postalcode,
        province: unitData[0].province,
        address: unitData[0].address,
      },
      unitdata_id: unitData[0].id,
      businesslicense,
      mainpart,
      loading: loading.global,
    };
  }
  return user;
};

export default connect(mapStateToProps)(UnitAdmin);
