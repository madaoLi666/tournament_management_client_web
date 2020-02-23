// 团队组别的性别数据接口类
export interface sexItem {
  sexId: number;
  isIncludeEnrollLimitation: boolean;
  unitMinEnrollNumber: number;
  unitMaxEnrollNumber: number;
  sex: number;
  scale: string; // 比例
  name: string;
  minTeamNumberLimitation: number;
  maxTeamNumberLimitation: number;
}

// 团队组别接口类
export interface GroupItem {
  groupId: number;
  name: string;
  eName: string; // 英文名
  startTime: string; // 如 2004-09-01
  endTime: string;
  sexData: Array<sexItem>;
}

// 团队项目角色接口类
export interface roleItem {
  id: number;
  openproject: number;
  cn_name: string;
  number: number;
}

// 团队项目接口类
export interface TeamItem {
  itemId: number;
  name: string;
  eName: string; // 英文名
  groupData: Array<GroupItem>;
  roleTypeList: Array<roleItem>;
}

// 适应选择器筛选的数组
export interface TeamProjectItem {
  itemId: number;
  itemName: string;
  items: Array<TeamProjectItem>;
}
