import { qSort } from '@/utils/sort';

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
  // group
  openprojectgroup:Array<GroupData>

}

// 整合来自服务器的数据，使数据更加简单明了
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
          name:sexName
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
        groupData
      })
    }else {
      tI.push({
        id: item.id,
        name: item.cn_name,
        eName: item.en_name,
        groupData
      })
    }
  }
  return { iI,tI }
}


// 获取列表方式
/*
* obj 需要获取的数组对象
* value 寻找值
* keyName 键值名
* */
export function getListByKey(obj: Array<any>, value: any, keyName: string ):any {
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
    return [];
  }else {
    if(index === 0) {
      // 无组可升
      return groupList.slice(0,1);
    }else if(index - upGroupNumber < 0){
      // 溢出
      return groupList.slice(0,index);
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
