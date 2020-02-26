import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../index.less';
import { Input, message, Modal, Select, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { legalAthleteFilter } from '@/utils/enroll';

const { Option } = Select;

interface TeamModalProps {
  visible: boolean;
  onCancel(): void;
}

function TeamModal(props: TeamModalProps, refs: any) {
  const { visible } = props;
  // 角色设置列表
  const [roleTypeList, setRoleTypeList] = useState<any>([]);
  const [teamName, setTeamName] = useState('');
  const [legalAthleteList, setLegalAthleteList] = useState<any>([]);
  // 规则 用于legalAthleteFilter 和 勾选后的判断
  const [rule, setRule] = useState<any>({});
  const [selectedAthleteList, setSelectedAthleteList] = useState([]);

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
      render: (text: any, _: any, index: number) => (
        <Select
          defaultValue={roleTypeList.length === 0 ? '' : roleTypeList[0].cn_name}
          onChange={(value: number) => handleRoleTypeSelect(value, index)}
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
      ),
    },
  ];

  const handleRoleTypeSelect = (value: number, index: number) => {
    // let { legalAthleteList } = this.state;
    // legalAthleteList[index].role = value;
    // this.setState({ legalAthleteList });
  };

  const handleCheckboxSelect = (record: any, selected: boolean) => {
    // TODO 这里可能需要深复制
    let tempAthleteList = selectedAthleteList as any;
    let index = -1;
    for (let i: number = tempAthleteList.length - 1; i >= 0; i--) {
      if (tempAthleteList[i] === record.id) {
        index = i;
        break;
      }
    }
    if (selected && index === -1) {
      tempAthleteList.push(record.id);
    } else if (!selected && index !== -1) {
      tempAthleteList.splice(index, 1);
    }
    setSelectedAthleteList(tempAthleteList);
  };
  const handleCheckSelectAll = (selected: boolean) => {
    if (selected) {
      // 当反选后 如果错误 执行了这个会有bug
      const tempAthleteList = legalAthleteList.map((v: any) => v.id);
      setLegalAthleteList(tempAthleteList);
    } else if (!selected) {
      setSelectedAthleteList([]);
    }
  };

  const rowSelection: TableRowSelection<any> = {
    fixed: true,
    onSelect: handleCheckboxSelect,
    onSelectAll: handleCheckSelectAll,
    selectedRowKeys: selectedAthleteList,
  };

  // 父组件在打开modal时调用该方法，设置state
  useImperativeHandle(refs, () => ({
    setInitialState: (
      teamEnroll: any,
      athleteList: any,
      currentItemGroupSexID: any,
      tempRule: any,
    ) => {
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
          return;
        }
      }
      // 判断出合法的运动员列表，置入state 打开modal
      let legalAthleteList = legalAthleteFilter(athleteList, tempRule);
      if (legalAthleteList.length !== 0) {
        // TODO 这里有bug，角色设置为队员，但是显示出来的是守门员
        for (let i: number = 0; i < legalAthleteList.length; i++) {
          legalAthleteList[i].role = 3;
        }
        setLegalAthleteList(legalAthleteList);
      } else {
        message.error('队伍中缺少符合该组别条件的人员');
      }
    },
    setRoleType: (data: any) => {
      setRoleTypeList(data);
    },
    setTeamRule: (data: any) => {
      setRule(data);
    },
  }));

  return (
    <Modal onCancel={props.onCancel} visible={visible}>
      <Input
        placeholder="请输入队伍名称"
        value={teamName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
      />
      <Table
        columns={tableColumns}
        dataSource={legalAthleteList}
        rowSelection={rowSelection}
        rowKey={(record: any) => record.id}
      />
    </Modal>
  );
}

export default forwardRef(TeamModal);
