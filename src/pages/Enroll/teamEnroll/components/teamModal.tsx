import React, { useState } from 'react';
import styles from '../index.less';
import { Input, Modal, Select } from 'antd';

const { Option } = Select;

interface TeamModalProps {
  visible: boolean;
  onCancel(): void;
}

function TeamModal(props: TeamModalProps) {
  const { visible } = props;
  // 角色设置列表
  const [roleTypeList, setRoleTypeList] = useState<any>([]);
  const [teamName, setTeamName] = useState('');

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

  return (
    <Modal onCancel={props.onCancel} visible={visible}>
      <Input
        placeholder="请输入队伍名称"
        value={teamName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
      />
    </Modal>
  );
}

export default TeamModal;
