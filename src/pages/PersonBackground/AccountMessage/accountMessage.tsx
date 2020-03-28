import React, { useEffect } from 'react';
import styles from './index.less';
import AccountList from '@/pages/PersonBackground/AccountMessage/components/accoutList';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

interface AccountMessageProps extends Partial<ConnectProps> {}

function AccountMessage(props: AccountMessageProps) {
  const { dispatch } = props;

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'account/getAccountBill',
      });
    }
  }, [dispatch]);

  return (
    <>
      <PageHeaderWrapper />
      <AccountList />
    </>
  );
}

const mapStateToProps = ({ account }: ConnectState) => {
  return account;
};

export default connect(mapStateToProps)(AccountMessage);
