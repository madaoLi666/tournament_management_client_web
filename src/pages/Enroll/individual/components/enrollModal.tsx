import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../index.less';
import { message, Modal, Select } from 'antd';
import { getGroupsByAge, getLegalSexList, getListByKey } from '@/utils/enroll';

const { Option } = Select;

interface EnrollModalProps {
  // dva中的 props 数据
  individualItemList: any;
  individualLimitation: any;
  group_age_list: any;

  // 上层table组件的数据
  currentAthleteData: any;
  itemGroupSexID: number;
  athleteName: string;
  setCurrentAthleteData(currentAthleteData: any): void; // 设置信息
  setItemGroupSexID(itemGroupSexID: number): void;
  setAthleteName(athleteName: string): void;

  // 控制modal的数据
  visible: boolean;
  loading: boolean;
  onCancel(): void;
  onEnroll(athleteData: any, id: number): void; // 报名
}

function EnrollModal(props: EnrollModalProps, refs: any) {
  const {
    visible,
    individualItemList,
    individualLimitation,
    onCancel,
    group_age_list,
    itemGroupSexID,
    athleteName,
    currentAthleteData,
    setItemGroupSexID,
    onEnroll,
    loading,
  } = props;

  const [itemValue, setItemValue] = useState<any>(undefined);
  const [groupValue, setGroupValue] = useState<any>(undefined);
  const [groupList, setGroupList] = useState<any>([]);
  const [sexValue, setSexValue] = useState<any>(undefined);
  const [sexList, setSexList] = useState<any>([]);

  // 重置所有state，方便在父组件中调用
  const resetState = () => {
    setGroupList([]);
    setSexList([]);
    setItemGroupSexID(-1);
    setGroupValue(undefined);
    setSexValue(undefined);
    setItemValue(undefined);
  };

  // ref模式，父组件在报名成功后调用该方法
  useImperativeHandle(refs, () => ({
    resetValue: () => {
      resetState();
    },
  }));
  // 报名提交触发
  const handleIndividualEnroll = (athleteData: any, id: number) => {
    onEnroll(athleteData, id);
  };

  const getGroupByItem = (
    athleteData: any,
    itemList: Array<any>,
    itemId: number,
    limitation: any,
  ) => {
    const { isCrossGroup } = individualLimitation;
    setItemValue(itemId);
    if (itemId) {
      // 清空下面的设置
      setGroupValue(undefined);
      setSexValue(undefined);
      setSexList([]);
      setItemGroupSexID(-1);
      // 拿出运动员出生日期
      const birthday = athleteData.athlete.birthday.slice(0, 10);
      // 若没有相应组别 则返回false
      let groupList = getListByKey(itemList, itemId, 'itemId')
        ? getListByKey(itemList, itemId, 'itemId').groupData
        : false;
      // 存在可用组别信息
      if (groupList) {
        const { upGroupNumber } = limitation;
        // 通过 年龄+组别列表+可升组数量 得到可选组别列表，例如可选青成组，少年组
        let r = getGroupsByAge(birthday, groupList, upGroupNumber, group_age_list);
        let fGroupList = [],
          fGroupValue = -1;
        if (r.length !== 0) {
          // 判断是否可以跨组别参赛
          if (isCrossGroup) {
            // 可以跨组
            // 将其原组别设置（位于数组最后一个）进入itemValue，但禁用选择框
            fGroupList = r;
            fGroupValue = r[r.length - 1].groupId;
          } else {
            // 不可以跨组
            // r的最后一项为原组别
            if (athleteData.project.upgrouppersonaldata.length !== 0) {
              // 已报名升组项目
              // 将前一个组别设置
              fGroupList = r;
              if (r.length === 1) {
                fGroupValue = r[0].groupId;
              } else {
                fGroupValue = r[r.length - 2].groupId;
              }
            } else if (athleteData.project.personaldata.length !== 0) {
              // 已报名原本组别项目
              // console.log(2);
              fGroupList = r;
              fGroupValue = r[r.length - 1].groupId;
            } else if (athleteData.project.hasOwnProperty('teamproject')) {
              // 判断 是否 有团队报名项目
              // 不能从个人项目中判断组别，去查看团体项目
              if (athleteData.project.teamproject.length === 0) {
                // 没有报团队项目
                fGroupList = r;
                fGroupValue = r[r.length - 1].groupId;
              } else {
                let isUpGroup: boolean = false;
                for (let i: number = athleteData.project.teamproject.length - 1; i >= 0; i--) {
                  if (athleteData.project.teamproject[i].isUpGroup) {
                    // 报了升组的项目
                    isUpGroup = true;
                    break;
                  }
                }
                if (isUpGroup) {
                  fGroupList = r;
                  fGroupValue = r[r.length - 2].groupId;
                } else {
                  fGroupList = r;
                  fGroupValue = r[r.length - 1].groupId;
                }
              }
            } else {
              // 什么项目没有报名
              fGroupList = r;
              fGroupValue = r[r.length - 1].groupId;
            }
          }
        }
        setGroupList(fGroupList);
        setGroupValue(fGroupValue);
        getSexByGroup(athleteData, fGroupList, fGroupValue);
      } else {
        message.warn('此项目没有适合该名运动员的组别');
        setGroupList([]);
      }
    } else {
      setGroupList([]);
      setSexList([]);
      setItemGroupSexID(-1);
    }
  };

  // 选中组别后 判别
  /*
   * athleteData - 运动员信息
   * groupList - 当前可选组别列表
   * groupId   - 选中组别列表
   * */
  const getSexByGroup = (athleteData: any, groupList: Array<any>, groupId: number) => {
    const { sex } = athleteData.athlete;
    let sexList = getListByKey(groupList, groupId, 'groupId')
      ? getListByKey(groupList, groupId, 'groupId').sexData
      : false;
    if (sexList && sexList.length !== 0) {
      let r = getLegalSexList(sex, sexList);
      setSexList(r);
      setGroupValue(groupId);
      setItemGroupSexID(r === false ? -1 : r[0].sexId);
      setSexValue(r === false ? undefined : r[0].name);
    } else {
      message.warn('没有开设符合您的性别组别');
      setSexList([]);
      setItemGroupSexID(-1);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okText={'添加报名项目'}
      cancelText={'取消'}
      title={athleteName === '' ? null : athleteName + '  请选择项目进行报名'}
      onOk={() => {
        handleIndividualEnroll(currentAthleteData, itemGroupSexID);
      }}
      confirmLoading={loading}
    >
      <div className={styles.r}>
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
      </div>
    </Modal>
  );
}

export default forwardRef(EnrollModal);
