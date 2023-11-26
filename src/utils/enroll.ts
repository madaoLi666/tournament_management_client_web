import { qSort, hSearch } from '@/utils/sort';
import { message } from 'antd';
import { GroupAgeList } from '@/models/gameListModel';
import { TeamProjectItem, TeamItem, GroupItem, sexItem } from '@/pages/Enroll/teamData';

interface SexData {
  openprojectgroup: number;
  id: number;
  // 组别
  cn_name: string;
  en_name: string;
  // 表明性别
  /*
   * man = 1 全男
   * woman = 1 全女
   * all = 1   男女不限
   * mix = 1   男女混合
   * mixeddoubles = 1  男女混双
   * scale = 'number:number' 男女比例混合
   * ======================== 转为 =======================>
   * 1-全男 2-全女 3-男女不限 4-男女混合 5-男女混双
   * 6-男女比例混合（并带有scale属性）
   * */

  all: 0 | 1;
  man: 0 | 1;
  mix: 0 | 1;
  mixeddoubles: 0 | 1;
  woman: 0 | 1;
  scale: string;
  // 单位最少最多人（队）限制
  unitleastnumber: number;
  unitmostnumber: number;
  // 是否计入个人报名项目数量
  eachenrollnumberenable: boolean;

  // 队伍限制数量
  teamnumberlimit: string;

  number: number;
}

interface GroupData {
  // 项目ID
  openproject: number;
  // 组别ID
  id: number;
  // 组别名称
  cn_name: string;
  en_name: string;
  starttime: string;
  endtime: string;
  // 单位报名数量限制
  unitenrollnumber: number;
  // 人（队）数量限制
  number: number;
  openprojectgroupsex: Array<SexData>;
}

interface ItemData {
  id: number;
  // 项目名称
  cn_name: string;
  en_name: string;
  // 项目属性
  competitionpersontype: number;
  formattype: number;
  matchbaseproject: number;
  matchcompetitiontype: number;
  matchdata: number;
  // 总人数限制，一般是999
  number: number;
  roletype: object;
  // group
  openprojectgroup: Array<GroupData>;
}

// 整合来自服务器的 项目-组别-性别 数据，使数据更加简单明了
export function convertItemData(itemList: Array<ItemData>): any {
  // 个人 双人 团队
  let iI = [],
    tI = [];
  for (let i: number = itemList.length - 1; i >= 0; i--) {
    const item = itemList[i];
    let groupData = [];
    for (let j: number = item.openprojectgroup.length - 1; j >= 0; j--) {
      const group = item.openprojectgroup[j];
      let sexData = [];
      for (let k: number = group.openprojectgroupsex.length - 1; k >= 0; k--) {
        const sex = group.openprojectgroupsex[k];
        let groupSex, sexName;
        if (sex.man === 1) {
          groupSex = 1;
          sexName = '男子组';
        } else if (sex.woman === 1) {
          groupSex = 2;
          sexName = '女子组';
        } else if (sex.all === 1) {
          groupSex = 3;
          sexName = '公开组';
        } else if (sex.mix === 1) {
          groupSex = 4;
          sexName = '男女混合（两种性别同时存在）';
        } else if (sex.mixeddoubles === 1) {
          groupSex = 5;
          sexName = '男女混双';
        } else {
          groupSex = 6;
          sexName = '男女比例';
        }
        sexData.push({
          sexId: sex.id,
          isIncludeEnrollLimitation: sex.eachenrollnumberenable,
          unitMinEnrollNumber: sex.unitleastnumber,
          unitMaxEnrollNumber: sex.unitmostnumber,
          sex: groupSex,
          scale: sex.scale,
          name: sexName,
          minTeamNumberLimitation: Number(sex.teamnumberlimit.split('-')[0]),
          maxTeamNumberLimitation: Number(sex.teamnumberlimit.split('-')[1]),
        });
      }
      groupData.push({
        groupId: group.id,
        name: group.cn_name,
        eName: group.en_name,
        startTime: group.starttime.slice(0, 10),
        endTime: group.endtime.slice(0, 10),
        sexData,
      });
    }
    if (item.competitionpersontype === 1) {
      iI.push({
        itemId: item.id,
        name: item.cn_name,
        eName: item.en_name,
        groupData,
        roleTypeList: item.roletype,
      });
    } else {
      tI.push({
        itemId: item.id,
        name: item.cn_name,
        eName: item.en_name,
        groupData,
        roleTypeList: item.roletype,
      });
    }
  }
  return { iI, tI };
}

// 整合来自服务器的运动员列表数据 - 将运动员的团体项目也放入个人信息中方便之后的统计于判断
export function convertAthleteList(athleteList: Array<any>, teamEnrollList: Array<any>): any {
  /* 先注释快排，因为想点击参赛后运动员位置不变 */
  // qSort(athleteList,0,athleteList.length - 1,'player');
  // 遍历所有队伍
  for (let i: number = teamEnrollList.length - 1; i >= 0; i--) {
    // 遍历队伍成员
    for (let k: number = teamEnrollList[i].teammember.length - 1; k >= 0; k--) {
      let index: number | undefined = -1;
      index = hSearch(athleteList, 'player', teamEnrollList[i].teammember[k].player);
      if (index) {
        athleteList[index].project.teamproject = [];
        const birthday = athleteList[index].athlete.birthday.substr(0, 10);
        // 在运动员信息中加入teamproject
        // console.log(teamEnrollList[i]);
        for (let j: number = teamEnrollList[i].groupprojectenroll.length - 1; j >= 0; j--) {
          athleteList[index].project.teamproject.push({
            ...teamEnrollList[i].groupprojectenroll[j],
            isUpGroup: !(
              birthday <= teamEnrollList[i].groupprojectenroll[j].endtime.substr(0, 10) &&
              birthday >= teamEnrollList[i].groupprojectenroll[j].starttime.substr(0, 10)
            ),
          });
        }
      }
    }
  }
  // 翻转数组，使参赛运动员在列表前
  // athleteList.reverse();
}

/* 查找数组的某个特定项
 * arr 需要获取的数组对象
 * value 寻找值
 * keyName 键值名
 * */
export function getListByKey(arr: Array<any>, value: any, keyName: string): any {
  for (let i: number = arr.length - 1; i >= 0; i--) {
    if (arr[i][keyName] === value) {
      return arr[i];
    }
  }
  return false;
}

/* 根据运动员 年龄信息 获取适合组别
 * birthday 出生年月日
 * groupList 组别列表
 * upGroupNumber 可升组数量 输出应该不upGroupNumber 多出1项 ,
 *                         -1 即代表不可升组
 * */
export function getGroupsByAge(
  birthday: string,
  groupList: Array<any>,
  upGroupNumber: number,
  group_age_list: Array<GroupAgeList>,
) {
  // 将所有的group按照startTime排序
  qSort(groupList, 0, groupList.length - 1, 'startTime');
  qSort(group_age_list, 0, group_age_list.length - 1, 'starttime');
  let index = -1;
  let j = 0;
  for (j; j < group_age_list.length; j++) {
    if (birthday >= group_age_list[j].starttime && birthday <= group_age_list[j].endtime) {
      if (j === 0) {
        index = 0;
      } else {
        index = j - upGroupNumber;
      }
      break;
    }
  }
  if (index >= group_age_list.length) {
    /* 如果升组后还是不符合条件，则返回空数组，例如儿童B升一组至A，报不了少年C */
    return [];
  }
  if (index === -1 && j === group_age_list.length + 1) {
    // 没有符合组别
    return [];
  } else {
    if (index === 0 && j === 0) {
      // 无组可升
      return groupList.slice(0, 1);
    } else {
      /* 如果groupList的长度 小于 groupAgeList 的长度，证明这个项目没有全部的年龄组别 */
      if (groupList.length < group_age_list.length) {
        // 先通过原index在groupAgeList的组别匹配出groupList相应的index2
        const group_name = group_age_list[index].cn_name; // 儿童C组
        let n = 0;
        for (n; n < groupList.length; n++) {
          if (groupList[n].name === group_name) {
            break;
          }
        }
        // 如果升的组比如少年C组，不在原项目组别比如只有儿童组时
        if (n === groupList.length) {
          // 找是否有符合本身年龄段的组别
          for (let k = 0; k < groupList.length; k++) {
            if (groupList[k].startTime <= birthday && groupList[k].endTime >= birthday) {
              return groupList.slice(k, k + 1 + upGroupNumber);
            }
          }
          return [];
        } else {
          return groupList.slice(n, n + 1 + upGroupNumber);
        }
      } else {
        // 将可升组别与原组别返回
        return groupList.slice(index, index + 1 + upGroupNumber);
      }
    }
  }
}

/* 根据 性别 获取适合的性别组别
 * sex 性别string
 * sexList
 * */
export function getLegalSexList(sex: string, sexList: Array<any>) {
  if (sex === '男') {
    return sexList.filter((v: any) => v.sex !== 2);
  } else if (sex === '女') {
    return sexList.filter((v: any) => v.sex !== 1);
  } else {
    return false;
  }
}

interface FilterRule {
  itemName: string;
  startTime: string;
  endTime: string;
  unitMinEnrollNumber: number;
  unitMaxEnrollNumber: number;
  sexType: number;
  scale: string;
  isIncludeEnrollLimitation: boolean;
  isCrossGroup: boolean;
  upGroupNumber: number;
  itemLimitation: number;

  minTeamNumberLimitation: number;
  maxTeamNumberLimitation: number;
  // 为该项目下的groupData
  groupList: Array<any>;
}

// 过滤不符合的运动员
/*
 * athleteList - 运动员列表
 * rule
 * */
export function legalAthleteFilter(athleteList: Array<any>, rule: FilterRule) {
  // 整理rule中的groupList 做排序
  qSort(rule.groupList);
  /**
   * 这里针对轮滑球来做固定的限制，青年组升成年组，不需要业余等级证
   */
  const { itemName, startTime, endTime } = rule;
  // console.log(athleteList);
  // console.log(rule);
  // 整理 将 已报项目数量整理处理
  // 整理时 如果有project内的升组或未升组的项目的长度不为零，则设置外面的itemNumber upGroupItemNumber，否则设为0
  // 这里多加了判断是否是淘汰赛的规则
  athleteList.forEach((m: any) => {
    let sum: number = 0;
    for (let i = 0; i < m.project.personaldata.length; i++) {
      if (m.project.personaldata[i].eachenrollnumberenable) {
        sum++;
      }
    }
    m.itemNumber = sum;
    m.upGroupItemNumber =
      m.project.upgrouppersonaldata.length !== 0 ? m.project.upgrouppersonaldata.length : 0;
    m.groupFlag = false;
  });
  const { sexType } = rule;
  /* 1、性别
   *  2、个人限报项目数量
   *  3、是否已有本团体项目的报名
   *  4、依照 是否可跨组参赛/是否可以升组/组别列表 判断是否合法
   * */

  /* 1 性别判断
   * sexType = 4  =》 至少要有一男一女,在本函数的最后处理了;
   */
  if (sexType === 1) {
    athleteList = athleteList.filter((v: any) => v.athlete.sex === '男');
  } else if (sexType === 2) {
    athleteList = athleteList.filter((v: any) => v.athlete.sex === '女');
  }
  // 2 个人限报数量 isIncludeEnrollLimitation是否计入个人项目
  const { itemLimitation, isIncludeEnrollLimitation } = rule;
  if (itemLimitation !== 0 && isIncludeEnrollLimitation) {
    athleteList = athleteList.filter((v: any) => {
      return v.itemNumber + v.upGroupItemNumber + v.teamname.length < itemLimitation;
    });
  }
  // 3是否已报本项目
  if (itemName !== '' && itemName) {
    athleteList = athleteList.filter((v: any) => {
      let isEnrollSameItem = false;
      if (v.teamname.length !== 0) {
        v.project.teamproject.forEach((m: any) => {
          let temp_name = m;
          if (temp_name === itemName) {
            isEnrollSameItem = true;
          }
        });
      }
      return !isEnrollSameItem;
    });
  } else {
    console.log('itemName is lost');
  }
  // console.log(athleteList);
  /*============================== 4 升组逻辑判断 ==============================*/
  /*
   *  1）判别运动员组别是否高于开设项目组别 - 使用生日判别 ->2）
   *  2）是否可以跨组参赛   否->3） 是->6）
   *  3）是否有已报项目     否->4)  是->5）
   *  4）向下取组
   *  5）根据已报项目得到组别，检查合法性
   *  6）根据groupList取判别原本组别，并获取可报组别列表 ->7）
   *  7）判别开设组别是否被其列表包含
   * */

  /********* 1 *********/
  athleteList = athleteList.filter(
    (v: any) =>
      v.athlete.birthday.substr(0, 10) >= startTime && v.athlete.birthday.substr(0, 10) <= endTime,
  );

  /********* 2 *********/
  const { upGroupNumber, groupList } = rule;
  if (!rule.isCrossGroup) {
    // 不可以跨组
    for (let i = athleteList.length - 1; i >= 0; i--) {
      /********* 3 *********/
      // if(athleteList[i].itemNumber === 0 && athleteList[i].upGroupItemNumber === 0) {
      /********* 4 *********/
      // 以组别列表筛选出适合的
      let index = -1,
        tarGroupList;
      for (let j: number = groupList.length - 1; j >= 0; j--) {
        if (rule.startTime === groupList[j].startTime) {
          index = j;
          break;
        }
      }
      /** 单排轮滑球的特例需求，青年组升组到成年组不需要证书 */
      if (itemName === '单排轮滑球' && startTime == '1960-01-01' && index !== -1) {
        if (index + upGroupNumber > groupList.length) {
          // 向下取组到底部 全取
          tarGroupList = groupList.slice(index, groupList.length - 1);
        } else {
          tarGroupList = groupList.slice(index, index + upGroupNumber);
        }
        tarGroupList.forEach((v: any) => {
          if (
            v.startTime <= athleteList[i].athlete.birthday.substr(0, 10) &&
            '2004-08-31' >= athleteList[i].athlete.birthday.substr(0, 10)
          ) {
            athleteList[i].groupFlag = true;
          }
        });
      } else if (index !== -1) {
        if (index + upGroupNumber > groupList.length) {
          // 向下取组到底部 全取
          tarGroupList = groupList.slice(index, groupList.length - 1);
        } else {
          if (index === 0) {
            tarGroupList = groupList.slice(index, index + upGroupNumber + 1);
          } else {
            tarGroupList = groupList.slice(index, index + upGroupNumber + 1);
          }
        }
        tarGroupList.forEach((v: any) => {
          if (
            v.startTime <= athleteList[i].athlete.birthday.substr(0, 10) &&
            v.endTime >= athleteList[i].athlete.birthday.substr(0, 10)
          ) {
            athleteList[i].groupFlag = true;
          }
        });
      }
      // }else {
      //   // 5 根据已报项目确定组别 暂时没办法做
      //   // 这里是，已经报了一个项目（包括团体加个人）的
      //   // 在 personaldata 和 upgouppersonaldata 中 仅仅会用一个有值
      //   let cGroup;
      // }
    }
  } else if (rule.isCrossGroup) {
    // 可以跨组参赛  不需要理会是否有报名项目,只需要向下取出groupList判别合法即可
    // 6 与 4 判断相同
    // 以组别列表筛选出适合的
    for (let i = athleteList.length - 1; i >= 0; i--) {
      let index = -1,
        tarGroupList;
      for (let j: number = groupList.length - 1; j >= 0; j--) {
        if (rule.startTime === groupList[j].startTime) {
          index = j;
          break;
        }
      }
      if (index !== -1) {
        if (index + upGroupNumber > groupList.length) {
          // 向下取组到底部 全取
          tarGroupList = groupList.slice(index, groupList.length - 1);
        } else {
          tarGroupList = groupList.slice(index, index + upGroupNumber + 1);
        }
        tarGroupList.forEach((v: any) => {
          if (
            v.startTime < athleteList[i].athlete.birthday.substr(0, 10) &&
            v.endTime > athleteList[i].athlete.birthday.substr(0, 10)
          ) {
            athleteList[i].groupFlag = true;
          }
        });
      }
    }
  } else {
    console.log('isCrossGroup is illegal');
  }

  // 这里等筛选好人再做SexType = 4 的判断，比较准确
  let my_athlete_list: any[] = athleteList.filter((v: any) => v.groupFlag);
  if (rule.sexType === 4) {
    let man_flag: boolean = false;
    let woman_flag: boolean = false;
    for (let i: number = 0; i < my_athlete_list.length; i++) {
      if (my_athlete_list[i].athlete.sex === '男') {
        man_flag = true;
      } else if (my_athlete_list[i].athlete.sex === '女') {
        woman_flag = true;
      }
    }
    if (!(man_flag && woman_flag)) {
      message.warning('请确认选择的运动员中至少有一男一女');
      return [];
    }
  }

  return my_athlete_list;
}

/** 团队报名使用，下面的三个函数都是类似的，只不过由于每种数据的属性名不同而分开
 * 通过团队项目数组匹配出选择器需要的格式数组,即由 itemId,itemName,items组成
 */
export function selectTeam(
  teams: TeamItem[],
  teamProjects: TeamProjectItem[] = [],
): TeamProjectItem[] {
  // 遍历数组，然后每个都push进去
  for (let i = 0; i < teams.length; i++) {
    // 先创建一个临时对象
    let tempTeamProject: TeamProjectItem = {
      itemId: 0,
      itemName: '',
      items: [],
    };
    tempTeamProject.itemId = teams[i].itemId;
    tempTeamProject.itemName = teams[i].name;
    tempTeamProject.items = selectGroup(teams[i].groupData);
    teamProjects.push(tempTeamProject);
  }
  return teamProjects;
}
// 原理同上面的函数
function selectGroup(groups: GroupItem[], teamProjects: TeamProjectItem[] = []): TeamProjectItem[] {
  for (let i = 0; i < groups.length; i++) {
    let tempTeamProject: TeamProjectItem = {
      itemId: 0,
      itemName: '',
      items: [],
    };
    tempTeamProject.itemId = groups[i].groupId;
    tempTeamProject.itemName = groups[i].name;
    tempTeamProject.items = selectSex(groups[i].sexData);
    teamProjects.push(tempTeamProject);
  }
  return teamProjects;
}
// 原理同上面的函数
function selectSex(sexData: sexItem[], teamProjects: TeamProjectItem[] = []): TeamProjectItem[] {
  for (let i = 0; i < sexData.length; i++) {
    let tempTeamProject: TeamProjectItem = {
      itemId: 0,
      itemName: '',
      items: [],
    };
    tempTeamProject.itemId = sexData[i].sexId;
    tempTeamProject.itemName = sexData[i].name;
    teamProjects.push(tempTeamProject);
  }
  return teamProjects;
}
