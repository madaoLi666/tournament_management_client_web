import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../index.less';
import { Input, message, Modal, Select, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { legalAthleteFilter } from '@/utils/enroll';

const { Option } = Select;

interface TeamModalProps {
  visible: boolean;
  onCancel(): void;
  onEnroll(): void;
  loading: boolean;
}

function TeamModal(props: TeamModalProps, refs: any) {
  const { visible, onCancel, onEnroll, loading } = props;
  // 角色设置列表
  const [roleTypeList, setRoleTypeList] = useState<any>([]);
  const [teamName, setTeamName] = useState('');
  const [legalAthleteList, setLegalAthleteList] = useState<any>([]);
  // 规则 用于legalAthleteFilter 和 勾选后的判断
  const [rule, setRule] = useState<any>({});
  const [selectedAthleteList, setSelectedAthleteList] = useState<any>([]);

  // 人员table
  const tableColumns = [
    {
      title: '名称',
      key: 'name',
      dataIndex: 'athlete',
      render: (text: any) => (
        <div key={text.id}>
          <span>{text.name}</span>
        </div>
      ),
    },
    {
      title: '选择角色',
      dataIndex: 'role',
      key: 'role',
      render: (text: any, record: any, index: number) => {
        // console.log(record.unitathlete_id);
        return(
        <Select
          defaultValue={roleTypeList.length === 0 ? '' : roleTypeList[0].cn_name}
          onChange={(value: number) => handleRoleTypeSelect(value, record.unitathlete_id)}
        >
          {roleTypeList.length !== 0 ? (
            roleTypeList.map((v: any) => (
              <Option value={v.id} key={v.id}>
                {v['cn_name']}
              </Option>
            ))
          ) : (
            <Option value={-1}>无数据</Option>
          )}
        </Select>
      )
      },
    },
  ];

  const handleRoleTypeSelect = (value: number, unitathlete_id: number) => {
    // console.log(index);
    let tempAthleteList = Object.assign([], legalAthleteList);
    for (let i = 0; i < tempAthleteList.length; i++) {
      if(tempAthleteList[i].unitathlete_id === unitathlete_id) {
        tempAthleteList[i].role = value;
      }
    }
    setLegalAthleteList(tempAthleteList);
  };

  const handleCheckboxSelect = (record: any, selected: boolean) => {
    let tempAthleteList = Object.assign([], selectedAthleteList);
    let index = -1;
    for (let i: number = tempAthleteList.length - 1; i >= 0; i--) {
      if (tempAthleteList[i] === record.unitathlete_id) {
        index = i;
        break;
      }
    }
    if (selected && index === -1) {
      tempAthleteList.push(record.unitathlete_id);
    } else if (!selected && index !== -1) {
      tempAthleteList.splice(index, 1);
    }
    setSelectedAthleteList(tempAthleteList);
  };

  const handleCheckSelectAll = (selected: boolean) => {
    if (selected) {
      let tempAthleteList = Object.assign([], legalAthleteList);
      const tempIdList = tempAthleteList.map((v: any) => v.unitathlete_id);
      setSelectedAthleteList(tempIdList);
    } else if (!selected) {
      setSelectedAthleteList([]);
    }
  };

  const rowSelection: TableRowSelection<any> = {
    onSelect: handleCheckboxSelect,
    onSelectAll: handleCheckSelectAll,
    selectedRowKeys: selectedAthleteList,
  };

  // 传递给父组件的方法
  useImperativeHandle(refs, () => ({
    setInitialState: (
      teamEnroll: any,
      athleteList: any,
      currentItemGroupSexID: any,
      tempRule: any,
    ): boolean => {
      //1. 按照相应规则，过滤合法运动员
      //2. 设置如legalAthleteList中
      //3. 开启模态框
      // currentItemGroupSexID 项目ID
      // 如果有团队队伍，查看是否已经报满
      if (teamEnroll.length !== 0) {
        let temp_teams = 0;
        for (let i: number = 0; i < teamEnroll.length; i++) {
          if (teamEnroll[i].open_group_id == currentItemGroupSexID) {
            temp_teams++;
          }
        }
        if (temp_teams === tempRule.unitMaxEnrollNumber) {
          message.error('本单位该项目该组别的数量已报满!');
          setLegalAthleteList([]);
          return false;
        }
      }
      // 判断出合法的运动员列表，置入state 打开modal
      let legalAthleteList = legalAthleteFilter(athleteList, tempRule);
      // console.log(legalAthleteList);
      if (legalAthleteList.length !== 0) {
        for (let i: number = 0; i < legalAthleteList.length; i++) {
          legalAthleteList[i].role = 3;
        }
        setLegalAthleteList(legalAthleteList);
        return true;
      } else {
        message.error('队伍中缺少符合该组别条件的人员');
        setLegalAthleteList([]);
        return false;
      }
    },
    setRoleType: (data: any) => {
      setRoleTypeList(data);
    },
    setTeamRule: (data: any) => {
      setRule(data);
    },
    closeModal: () => {
      setTeamName('');
      setSelectedAthleteList([]);
    },
    handleEnroll: (currentItemGroupSexID: any): object => {
      if (teamName === '' || teamName === undefined) {
        message.warn('请先填写队名');
        return {};
      }
      // 判断人数是否符合
      const { maxTeamNumberLimitation, minTeamNumberLimitation } = rule;
      if (
        selectedAthleteList.length < minTeamNumberLimitation ||
        selectedAthleteList.length > maxTeamNumberLimitation
      ) {
        message.warn('队伍人数不符合报名要求');
        return {};
      }
      // 判断性别 应该与生成数据一齐做
      let m: number = 0,
        w: number = 0;
      let player: Array<any> = [];
      selectedAthleteList.forEach((v: number) => {
        for (let i: number = legalAthleteList.length - 1; i >= 0; i--) {
          if (v === legalAthleteList[i].unitathlete_id) {
            player.push({
              player: legalAthleteList[i].player,
              roletype: legalAthleteList[i].role,
            });
            if (legalAthleteList[i].athlete.sex === '男') m += 1;
            if (legalAthleteList[i].athlete.sex === '女') w += 1;
            break;
          }
        }
      });
      // 对rule中 sexType 进行性别判别
      /*
       * 全男/全女在filter中已经筛选
       * */
      const { sexType } = rule;
      if (sexType !== 1 && sexType !== 2 && sexType !== 3) {
        if (sexType === 4 && (m === 0 || w === 0)) {
          message.warn('男性或女性至少存在一个');
          return {};
        }
        if (sexType === 5 && (m !== 1 || w !== 1)) {
          message.warn('此项目为男女混双，参赛队伍组成必须为一男一女');
          return {};
        }
        // scale
        if (sexType === 6) {
          console.log('[teamModal]sexType = 6');
        }
      }
      // 这里给轮滑球一个写死先，因为赛事设置中并没有设置，轮滑球项目中，必须要有两名守门员
      if (rule.itemName == '单排轮滑球') {
        let sum = 0;
        for (let i = 0; i < player.length; i++) {
          if (player[i].roletype !== 3) {
            sum++;
          }
        }
        if (sum != 2) {
          message.warning('队伍中必须有两名守门员');
          return {};
        }
      }
      return {
        name: teamName,
        openprojectgroupsex: currentItemGroupSexID,
        player,
      };
    },
  }));

  return (
    <Modal
      onOk={onEnroll}
      onCancel={onCancel}
      visible={visible}
      title={'选择队员进行团队报名'}
      okText={'报名'}
      cancelText={'取消'}
      confirmLoading={loading}
    >
      <Input
        placeholder="请输入队伍名称"
        value={teamName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
      />
      <Table
        columns={tableColumns}
        dataSource={legalAthleteList}
        rowSelection={rowSelection}
        size={'small'}
        rowKey={(record: any) => {
          // console.log(record);
          return record.unitathlete_id;
        }}
      />
    </Modal>
  );
}

export default forwardRef(TeamModal);
