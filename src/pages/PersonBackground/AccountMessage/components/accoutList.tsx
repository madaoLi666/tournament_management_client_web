import React from 'react';
import styles from '../index.less';
import { AccountBill } from '@/pages/PersonBackground/models/accountModel';
import { List } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { UnorderedListOutlined } from '@ant-design/icons/lib';

interface AccountListProps {
  dataSource?: AccountBill[];
  loading: boolean;
}

function AccountList(props: AccountListProps) {
  const { dataSource, loading } = props;

  return (
    <List
      itemLayout="horizontal"
      loading={loading}
      className={styles.list}
      dataSource={dataSource ? dataSource : []}
      renderItem={item => (
        <List.Item>
          <div className={styles.billHeader}>
            <span>
              <UnorderedListOutlined style={{ color: '#FF3399' }} />
            </span>
            <span>操作时间：{item.time.substr(0, 10)}</span>
          </div>
          <div className={styles.billContent}>
            <div>{item.title}费用</div>
            <div>￥{item.price}</div>
            <div style={item.status === '支付成功' ? { color: '#52c41a' } : { color: '#faad14' }}>
              {item.status}
            </div>
          </div>
        </List.Item>
      )}
    />
  );
}

const mapStateToProps = ({ account, loading }: ConnectState) => {
  return {
    dataSource: account.byId,
    loading: loading.global,
  };
};

export default connect(mapStateToProps)(AccountList);
