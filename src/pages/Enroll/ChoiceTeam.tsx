import React, { useEffect, useRef } from 'react';
import {
  Avatar,
  Button,
  Card,
  Input,
  List,
  Radio,
  Badge
} from 'antd';
// @ts-ignore
import styles from './ChoiceTeam/style.less';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { router } from 'umi';
import { findDOMNode } from 'react-dom';
import { ConnectState } from '@/models/connect';
import { EnrollTeamData } from '@/pages/Enroll/ChoiceTeam/data';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

interface ChoiceTeamProps {
  dispatch: Dispatch;
  loading: boolean;
  currentMatchId: number;
  unitId: number;
  unitData: EnrollTeamData[];
  unitName: string;
}

function ChoiceTeam(props: ChoiceTeamProps) {
  let addBtn = useRef<HTMLButtonElement | undefined | null>(undefined);
  const { dispatch, loading, currentMatchId, unitId, unitData, unitName } = props;

  useEffect(() => {
    if (currentMatchId !== null && currentMatchId !== undefined) {
        dispatch({
          type: 'enroll/getContestantUnitData',
          payload: { matchId: currentMatchId, unitId: unitId }
        })
    }else {
      console.log('currentMatchId is undefined: ', currentMatchId);
    }
  },[unitId, currentMatchId]);

  const extraContent = (
    <div className={styles.extraContent} >
      <RadioGroup defaultValue="all" >
        <RadioButton value={"all"} >全部</RadioButton>
        <RadioButton value={"progress"} >进行中</RadioButton>
        <RadioButton value={"waiting"} >等待中</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} onSearch={() => ({})} placeholder={"请输入"}  />
    </div>
  );
  /********************* 添加新队伍时触发的事件 ********************/
  function addTeam() {
    window.localStorage.setItem('currentTeamId', '');
    router.push('/enroll/editUnitInfo');
  }
  /********************* 分页选项 ********************/
  const paginationProps = {
    // showSizeChanger: true,
    // showQuickJumper: true,
    pageSize: 5,
    total: unitData.length,
  };
  /********************* 队伍列表主体 ********************/
  const ListContent = ({data: { status }}: {
    data: EnrollTeamData;
  }) => (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <Badge status={status === '已结束' ? 'default' : 'success'} text={status} />
      </div>
    </div>
  );
  /********************* 进入editUnitInfo页面，绑定队伍的id ********************/
  function entryEditUnitInfo(e: any, id: number) {
    // 将队伍ID存入localstorage里面，当页面刷新时，还能通过这个去判断信息
    window.localStorage.setItem('currentTeamId', String(id));
    router.push('/enroll/editUnitInfo');
  }

  return (
    <Card
      className={styles.listCard}
      bordered={false}
      title={<strong>单位：{unitName}</strong>}
      style={{ marginTop: 24 }}
      bodyStyle={{ padding: '0 32px 40px 32px' }}
      // extra={extraContent}
    >
      <Button
        type="dashed"
        style={{ width: '100%', margin: '16px 0' }}
        icon="plus"
        onClick={addTeam}
        ref={component => {
          // @ts-ignore
          addBtn = findDOMNode(component) as HTMLButtonElement;
        }}
      >
        添加
      </Button>
      <List
        size="large"
        rowKey="id"
        loading={loading}
        pagination={paginationProps}
        dataSource={unitData}
        renderItem={item => (
          <List.Item
            actions={[
              <Button className={styles.smallBtn} onClick={(e) => {entryEditUnitInfo(e,item.id)}} key="entry" type="primary" >进入</Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.url_dutybook} shape="square" size="large" />}
              title={<a >{item.name}</a>}
              description={item.leader + ' | ' + item.leaderphonenumber + ' | ' + item.email}
            />
            <ListContent data={item} />
          </List.Item>
        )}
      />
    </Card>
  )
}

const mapStateToProps = ({ loading, enroll, unit }: ConnectState) => {
  return {
    loading: loading.global,
    currentMatchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    unitData: enroll.unit.unitData,
    unitName: unit.mainpart
  }
};

export default connect(mapStateToProps)(ChoiceTeam);
