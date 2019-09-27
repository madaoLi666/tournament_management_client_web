import { qSort, hSearch } from '@/utils/sort';

interface SexData {
  openprojectgroup:number,
  id:number,
  // 组别
  cn_name:string,
  en_name:string,
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

  all:0|1,
  man:0|1,
  mix:0|1,
  mixeddoubles:0|1,
  woman:0|1,
  scale:string,
  // 单位最少最多人（队）限制
  unitleastnumber:number,
  unitmostnumber:number,
  // 是否计入个人报名项目数量
  eachenrollnumberenable:boolean

  // 队伍限制数量
  teamnumberlimit:string;

  number:number
}

interface GroupData {
  // 项目ID
  openproject:number,
  // 组别ID
  id:number,
  // 组别名称
  cn_name:string,
  en_name:string,
  starttime:string,
  endtime:string,
  // 单位报名数量限制
  unitenrollnumber:number
  // 人（队）数量限制
  number:number,
  openprojectgroupsex: Array<SexData>
}

interface ItemData {
  id:number,
  // 项目名称
  cn_name:string,
  en_name:string,
  // 项目属性
  competitionpersontype:number,
  formattype:number,
  matchbaseproject: number,
  matchcompetitiontype: number,
  matchdata: number,
  // 总人数限制
  number: 999,
  roletype:object;
  // group
  openprojectgroup:Array<GroupData>

}

// 整合来自服务器的 项目-组别-性别 数据，使数据更加简单明了
export function convertItemData(itemList: Array<ItemData>):any {
  // 个人 双人 团队
  let iI = [], tI = [];
  for(let i: number = itemList.length - 1 ; i >= 0 ; i-- ) {
    const item  = itemList[i];
    let groupData = [];
    for(let j: number = item.openprojectgroup.length - 1 ; j >= 0; j-- ) {
      const group = item.openprojectgroup[j];
      let sexData = [];
      for(let k: number = group.openprojectgroupsex.length - 1 ; k >= 0; k-- ) {
        const sex = group.openprojectgroupsex[k];
        let groupSex,sexName;
        if(sex.man === 1) {
          groupSex = 1;
          sexName = '男子组';
        }else if(sex.woman === 1) {
          groupSex = 2;
          sexName = '女子组';
        }else if(sex.all === 1) {
          groupSex = 3;
          sexName = '公开组';
        }else if(sex.mix === 1) {
          groupSex = 4;
          sexName = '男女混合（两种性别同时存在）';
        }else if(sex.mixeddoubles === 1) {
          groupSex = 5;
          sexName = '男女混双';
        }else{
          groupSex = 6;
          sexName = '男女比例';
        }
        sexData.push({
          sexId: sex.id,
          isIncludeEnrollLimitation: sex.eachenrollnumberenable,
          unitMinEnrollNumber: sex.unitleastnumber,
          unitMaxEnrollNumber: sex.unitmostnumber,
          sex:groupSex,
          scale: sex.scale,
          name:sexName,
          minTeamNumberLimitation: Number(sex.teamnumberlimit.split('-')[0]),
          maxTeamNumberLimitation: Number(sex.teamnumberlimit.split('-')[1])
        })
      }
      groupData.push({
        groupId:group.id,
        name: group.cn_name,
        eName: group.en_name,
        startTime: group.starttime.slice(0,10),
        endTime: group.endtime.slice(0,10),
        sexData
      })
    }
    if(item.competitionpersontype === 1) {
      iI.push({
        itemId: item.id,
        name: item.cn_name,
        eName: item.en_name,
        groupData,
        roleTypeList: item.roletype
      })
    }else {
      tI.push({
        itemId: item.id,
        name: item.cn_name,
        eName: item.en_name,
        groupData,
        roleTypeList: item.roletype
      })
    }
  }
  return { iI,tI }
}

// 整合来源于服务区的运动员列表数据 - 将运动员的团体项目也放入个人信息中方便之后的统计于判断
export function convertAthleteList(athleteList: Array<any>,teamEnrollList: Array<any>): any {
  qSort(athleteList,0,athleteList.length - 1,'player');
  // 遍历所有队伍
  for(let i:number = teamEnrollList.length - 1 ; i >= 0; i--) {
    // 遍历队伍成员
    for(let k:number = teamEnrollList[i].teammember.length - 1  ; k >= 0 ; k--) {
      let index:number = -1;
      index = hSearch(athleteList,'player',teamEnrollList[i].teammember[k].player);
      if(index) {
        athleteList[index].project.teamproject = [];
        const birthday = athleteList[index].athlete.birthday.substr(0,10);
        // 在运动员信息中加入teamproject
        for(let j:number = teamEnrollList[i].groupprojectenroll.length - 1; j >= 0 ; j--) {
          athleteList[index].project.teamproject.push({
            ...teamEnrollList[i].groupprojectenroll[j],
            isUpGroup: (!(birthday <= teamEnrollList[i].groupprojectenroll[j].endtime.substr(0, 10) && birthday >= teamEnrollList[i].groupprojectenroll[j].starttime.substr(0, 10)))
          });
        }
      }
    }
  }
  // 翻转数组，使参赛运动员在列表前
  athleteList.reverse();
}


// 获取列表方式
/*
* obj 需要获取的数组对象
* value 寻找值
* keyName 键值名
* */
export function getListByKey(obj: Array<any>, value: any, keyName: string ):any {
  console.log(obj);
  for(let i:number = obj.length - 1; i>= 0; i--) {
    if(obj[i][keyName] === value) {
      return obj[i];
    }
  }
  return false;
}

// 根据运动员 年龄信息 获取适合组别
/*
* birthday 出生年月日
* groupList 组别列表
* upGroupNumber 可升组数量 输出应该不upGroupNumber 多出1项 ,
*                         -1 即代表不可升组
* */
export function getGroupsByAge(birthday:string, groupList:Array<any>, upGroupNumber: number) {
  qSort(groupList,0,groupList.length-1,"startTime");
  let index:number = -1;
  for(let i:number = groupList.length - 1; i >= 0 ;i--) {
    // 符合条件
    if(birthday >= groupList[i].startTime && birthday <= groupList[i].endTime) {
      index = i;
      break;
    }
  }
  if(index === -1) {
    // 没有符合组别
    return [];
  }else {
    if(index === 0) {
      // 无组可升
      return groupList.slice(0,1);
    }else if(index - upGroupNumber < 0){
      // 溢出
      return groupList.slice(0,index+1);
    }else {
      // 将可升组别与原组别返回
      return groupList.slice(index-upGroupNumber,index+1);
    }
  }
}

// 根据 性别 获取适合的性别组别
/*
* sex 性别string
* sexList
* */
export function getLegalSexList(sex: string, sexList: Array<any>) {
  if(sex === '男') {
    return sexList.filter((v: any) => (v.sex !== 2));
  }else if(sex === '女'){
    return sexList.filter((v: any) => (v.sex !== 1));
  }else {
    return false;
  }
}

interface FilterRule {
  itemName:string;
  startTime:string;
  endTime:string;
  unitMinEnrollNumber:number;
  unitMaxEnrollNumber:number;
  sexType:number;
  scale:string;
  isIncludeEnrollLimitation:boolean;
  isCrossGroup:boolean;
  upGroupNumber:number;
  itemLimitation:number;

  minTeamNumberLimitation:number;
  maxTeamNumberLimitation:number;
  // 为该项目下的groupData
  groupList:Array<any>
}

// 过滤不符合的运动员
/*
* athleteList - 运动员列表
* rule
* */
export function legalAthleteFilter(athleteList: Array<any>, rule:FilterRule,) {
  // 整理rule中的groupList 做排序
  qSort(rule.groupList);

  // 整理 将 已报项目数量整理处理
  // TODO 查看这里整理了什么已报项目，现在是某个人报了一个个人，团队这里就消失了
  athleteList.forEach((m:any) => {
    m.itemNumber = (m.project.hasOwnProperty('personaldata')) ? m.project.personaldata.length : 0;
    m.upGroupItemNumber = (m.project.hasOwnProperty('upgrouppersonaldata')) ? m.project.upgrouppersonaldata.length : 0;
    m.groupFlag = false;
  });
  const { sexType } = rule;
  /* 1、性别
  *  2、个人限报项目数量
  *  3、是否已有本团体项目的报名
  *  4、依照 是否可跨组参赛/是否可以升组/组别列表 判断是否合法
  * */
  // 1 性别判断
  if(sexType === 1){
    athleteList = athleteList.filter((v:any) => (v.athlete.sex === '男'));
  }else if(sexType === 2){
    athleteList = athleteList.filter((v:any) => (v.athlete.sex === '女'));
  }
  // 2 个人限报数量
  const { itemLimitation } = rule;
  if(itemLimitation !== 0) {
    athleteList = athleteList.filter((v:any) => {
      //
      return ((v.itemNumber + v.upGroupItemNumber) < itemLimitation)
    })
  }else{
    console.log('itemLimitation is 0');
  }
  // 3是否已报本项目
  const { itemName } = rule;
  if(itemName !== "" && itemName) {
    athleteList = athleteList.filter((v:any) => {
      let isEnrollSameItem = false;
      if(v.itemNumber !== 0) v.project.personaldata.forEach((m:any) => {
          if(m.name === itemName) {
            isEnrollSameItem = true;
          }
        });
      if(v.upGroupItemNumber !== 0)v.project.upgrouppersonaldata.forEach((m:any) => {
          if(m.name === itemName) {
            isEnrollSameItem = true;
          }
        });
      return !isEnrollSameItem;
    })
  }else {
    console.log('itemName is lost');
  }
  // 这个暂时没有办法取做校验 2019-08-29

  /*============================== 4 升组逻辑判断 ==============================*/
  /*
  *  1）判别运动员组别是否高于开设项目组别 - 使用生日判别 ->2）
  *  2）是否可以跨组参赛   否->3） 是->6）
  *  3）是否有已报项目     否->4)  是->5）
  *  4）向下取组 -> null
  *  5）根据已报项目得到组别，检查合法性 -> null
  *  6）根据groupList取判别原本组别，并获取可报组别列表 ->7）
  *  7）判别开设组别是否被其列表包含 -> null
  * */
  // 1
  const { startTime } = rule;
  athleteList = athleteList.filter((v:any) => (v.athlete.birthday.substr(0,10) > startTime));
  // 2
  const { upGroupNumber , groupList } = rule;
  if(!rule.isCrossGroup) {
    for(let i = athleteList.length - 1 ; i >= 0 ; i--) {
      // 3
      if(athleteList[i].itemNumber === 0 && athleteList[i].upGroupItemNumber === 0) {
        // 4
        // 以组别列表筛选出适合的
        let index = -1,tarGroupList;
        for(let j:number = groupList.length -1 ; j >= 0 ; j--) {
          if(rule.startTime === groupList[j].startTime) {index = j;break;}
        }
        if(index !== -1) {
          if(index + upGroupNumber > groupList.length) {
            // 向下取组到底部 全取
            tarGroupList = groupList.slice(index,groupList.length -1);
          }else {
            tarGroupList = groupList.slice(index,index + upGroupNumber);
          }
          tarGroupList.forEach((v:any) => {
            if(v.startTime < athleteList[i].athlete.birthday.substr(0,10) && v.endTime >  athleteList[i].athlete.birthday.substr(0,10) ) {
              athleteList[i].groupFlag = true;
            }
          })
        }
      }else {
        // 5 根据已报项目确定组别 暂时没办法做
        // 在 personaldata 和 upgouppersonaldata 中 仅仅会用一个有值
        let cGroup;
      }
    }
  }else if(rule.isCrossGroup) {
    //  可以跨组参赛  不需要理会是否有报名项目， 只需要向下取出groupList判别合法即可
    // 6  与 4 判断相同
    // 以组别列表筛选出适合的
    for(let i = athleteList.length - 1 ; i >= 0 ; i--) {
      let index = -1, tarGroupList;
      for (let j: number = groupList.length - 1; j >= 0; j--) {
        if (rule.startTime === groupList[j].startTime) {
          index = j;
          break;
        }
      }
      if (index !== -1) {
        // 这个位置可能有bug
        if (index + upGroupNumber > groupList.length) {
          // 向下取组到底部 全取
          tarGroupList = groupList.slice(index, groupList.length - 1);
        } else {
          tarGroupList = groupList.slice(index, index + upGroupNumber);
        }
        tarGroupList.forEach((v: any) => {
          if (v.startTime < athleteList[i].athlete.birthday.substr(0, 10) && v.endTime > athleteList[i].athlete.birthday.substr(0, 10)) {
            athleteList[i].groupFlag = true;
          }
        })
      }
    }
  }else{
    console.log('isCrossGroup is illegal');
  }

  return athleteList.filter((v:any) => v.groupFlag);
}

// 判断报名人员性别是否符合要求
/*
* athlete
* */
