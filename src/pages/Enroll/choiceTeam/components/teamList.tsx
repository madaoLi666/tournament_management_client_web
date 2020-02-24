import React from 'react';
import styles from '../index.less';
import { Avatar, Badge, Button, List, message } from 'antd';
import { EnrollTeamData } from '@/models/enrollModel';
import { router } from 'umi';

interface TeamListProps {
  loading: boolean;
  unitData: EnrollTeamData[];
  currentMatchId?: number;
}

function TeamList(props: TeamListProps) {
  const { loading, unitData, currentMatchId } = props;
  /********************* 分页选项 ********************/
  const paginationProps = {
    pageSize: 5,
    total: unitData.length,
  };
  /********************* 队伍列表主体 ********************/
  const ListContent = ({ data: { status } }: { data: EnrollTeamData }) => (
    <div className={styles.badge}>
      <Badge
        status={status === '已结束' ? 'default' : 'success'}
        text={status}
      />
    </div>
  );
  /********************* 进入editUnitInfo页面，绑定队伍的id ********************/
  const entryEditUnitInfo = (e: any, id: number) => {
    // 将队伍ID放入路径里面，当页面刷新时，还能通过这个去判断信息
    if (currentMatchId === undefined) {
      message.error('[teamList]currentMatchId is undefined!');
      return;
    }
    router.push({
      pathname: '/enroll/editUnitInfo/' + String(currentMatchId),
      query: {
        teamId: String(id),
      },
    });
  };

  return (
    <List
      size="large"
      rowKey="id"
      loading={loading}
      pagination={paginationProps}
      dataSource={unitData}
      renderItem={item => (
        <List.Item
          actions={[
            <Button
              onClick={e => {
                entryEditUnitInfo(e, item.id);
              }}
              key="entry"
              type="primary"
              loading={loading}
            >
              进入
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar src={item.url_dutybook} shape="square" size="large" />
            }
            title={<a>{item.name}</a>}
            description={
              item.leader + ' | ' + item.leaderphonenumber + ' | ' + item.email
            }
          />
          <ListContent data={item} />
        </List.Item>
      )}
    />
  );
}

export default TeamList;
