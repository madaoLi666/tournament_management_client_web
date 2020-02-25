import React, { useState } from 'react';
import styles from '../index.less';
import { Button, Modal, Select } from 'antd';

const { Option } = Select;

interface EnrollModalProps {
  visible: boolean;
  individualItemList: any;
  individualLimitation: any;
}
// TODO 逻辑处理放在hooks中，然后返回数据渲染
function EnrollModal(props: EnrollModalProps) {
  const { visible, individualItemList, individualLimitation } = props;
  const [currentAthleteData, setCurrentAthleteData] = useState<any>({});
  const [itemValue, setItemValue] = useState<any>();
  const [groupValue, setGroupValue] = useState<any>();
  const [groupList, setGroupList] = useState<any>();
  const [sexValue, setSexValue] = useState<any>();
  const [sexList, setSexList] = useState<any>();
  const [itemGroupSexID, setItemGroupSexID] = useState<any>();

  const handleIndividualEnroll = (currentAthleteData: any, itemGroupSexID: any) => {};

  const getGroupByItem = (
    currentAthleteData: any,
    individualItemList: any,
    value: number,
    individualLimitation: any,
  ) => {};

  const getSexByGroup = (currentAthleteData: any, groupList: any, value: number) => {};

  return (
    <Modal visible={visible}>
      <div>
        <div className={styles['r']}>
          <Select
            onChange={(value: number) =>
              getGroupByItem(currentAthleteData, individualItemList, value, individualLimitation)
            }
            placeholder="请选择项目"
            value={itemValue}
          >
            {individualItemList.map((v: any) => (
              <Option key={`item-${v.itemId}`} value={v.itemId}>
                {v.name}
              </Option>
            ))}
          </Select>
          <div></div>
        </div>

        <div className={styles.r}>
          <Select
            onChange={(value: number) => getSexByGroup(currentAthleteData, groupList, value)}
            // 只有升组可升两组才可以选择
            disabled={individualLimitation.upGroupNumber < 1}
            placeholder="请选择组别"
            value={groupValue}
          >
            {groupList.length === 0
              ? null
              : groupList.map((v: any) => (
                  <Option value={v.groupId} key={v.groupId}>
                    {v.name}
                  </Option>
                ))}
            <Option value={-1} key={-1}>
              无可选组别
            </Option>
          </Select>
          <Select
            onChange={(value: any) => {
              setItemGroupSexID(value);
              setSexValue(value);
            }}
            disabled={sexList.length === 0}
            placeholder="请选择性别组别"
            value={sexValue}
          >
            {sexList.length === 0
              ? null
              : sexList.map((v: any) => (
                  <Option value={v.sexId} key={v.sexId}>
                    {v.name}
                  </Option>
                ))}
          </Select>
          <br />
        </div>
        <Button
          type="primary"
          onClick={() => handleIndividualEnroll(currentAthleteData, itemGroupSexID)}
        >
          添加报名项目
        </Button>
      </div>
    </Modal>
  );
}

export default EnrollModal;
