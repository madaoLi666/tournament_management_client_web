import React from 'react';
import { connect } from 'dva';
import { TreeSelect, Button, Modal, Table, Input, Select, message } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { legalAthleteFilter } from '@/utils/enroll.ts';
import { teamEnroll, deleteTeam } from '@/services/enroll';
import router from 'umi/router';
import { TableRowSelection } from 'antd/es/table';

// @ts-ignore
import styles from './index.less';

const { Option } = Select;
const { TreeNode } = TreeSelect;

class TeamEnroll extends React.Component<any,any>{

  constructor(props:any) {
    super(props);
    this.state = {
      modalVisible: false,
      // 项目id
      currentItemGroupSexID: -1,
      //
      legalAthleteList:[],
      // 规则 用于legalAthleteFilter 和 勾选后的判断
      rule:{},
      // id数组
      selectedAthleteList:[],
      teamName:'',
      // 角色设置列表
      roleTypeList:[]
    }
  }

  // updateItemData = () => {
  //   const { matchId, unitId, dispatch } = this.props;
  //
  //   dispatch({ type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: { matchId, unitId } })
  // };

  // 更新时重新获取
  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
    const { matchId, unitId, dispatch } = this.props;
    if( matchId && unitId && (unitId !== prevProps.unitId || matchId !== prevProps.matchId) ) {
      //
      dispatch({ type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: { matchId, unitId } });
    }
  }

  /*============================ TreeSelect ============================================*/
  //
  handleTreeSelectChange = (value: any, label: any, extra: any) => {
    const { teamItem, individualLimitation } = this.props;
    // 取最后的ItemGroupSexID - 即 服务端 projectgroupsexid
    if(value){
      let ItemGroupSexIDArr = value.split('-');
      this.setState({currentItemGroupSexID: ItemGroupSexIDArr[2]});
      // 根据id设置 group 规则
      let rule = {
        itemName:'',
        startTime:'',
        endTime:'',
        unitMaxEnrollNumber: '',
        unitMinEnrollNumber: '',
        sexType:'',
        isIncludeEnrollLimitation: false,
        scale:'',
        groupList: Array
      };
      for(let i:number = 0; i < teamItem.length ; i++) {
        // 项目id相同
        if(teamItem[i].itemId === Number(ItemGroupSexIDArr[0])) {
          this.setState({roleTypeList: teamItem[i].roleTypeList});
          rule.itemName = teamItem[i].name;
          rule.groupList = teamItem[i].groupData;
          const g = teamItem[i].groupData;
          for(let j:number = 0 ; j < g.length ; j++) {
            // 组别id相同
            // 获取组别层规则
            if(g[j].groupId === Number(ItemGroupSexIDArr[1])) {
              rule.startTime = g[j].startTime;
              rule.endTime = g[j].endTime;
              const s = g[j].sexData;
              for(let k:number = 0 ; k < s.length ; k++) {
                // 性别id相同
                // 获取性别层规则
                if(s[k].sexId === Number(ItemGroupSexIDArr[2])) {
                  rule.unitMinEnrollNumber = s[k].unitMinEnrollNumber;
                  rule.unitMaxEnrollNumber = s[k].unitMaxEnrollNumber;
                  rule.isIncludeEnrollLimitation = s[k].isIncludeEnrollLimitation;
                  rule.sexType = s[k].sex;
                  rule.scale = s[k].scale;
                  //@ts-ignore
                  rule.minTeamNumberLimitation = s[k].minTeamNumberLimitation;
                  //@ts-ignore
                  rule.maxTeamNumberLimitation = s[k].maxTeamNumberLimitation;
                  break;
                }
              }
              break;
            }
          }
        }
      }
      this.setState({rule:{...rule,...individualLimitation}});
    }else {
      message.error('尚未设置团队项目');
    }
  };
  // 初始化树桩选择器dom
  initialTreeDOM = (item:Array<any>):React.ReactNode => {

    let res:Array<React.ReactNode> = [];
    if(item && item.length !== 0) {
      for(let i:number = item.length - 1 ; i >= 0 ; i--) {
        const group = item[i].groupData;
        // 判断空
        if(group && group.length === 0) break;
        let groupDOM: Array<React.ReactNode> = [];
        for(let j:number = group.length - 1 ; j >= 0 ; j--) {
          const sex = group[j].sexData;
          // 判断空
          if(sex && sex.length === 0) break;
          let sexDOM:Array<React.ReactNode> = [];
          for(let k:number = sex.length - 1 ; k >= 0 ; k--) {
            sexDOM.push(
              <TreeNode
                title={`${item[i].name}-${group[j].name}-${sex[k].name}`}
                value={`${item[i].itemId}-${group[j].groupId}-${sex[k].sexId}`}
                key={`sex-${sex[k].sexId}`}
              />
              )
          }
          groupDOM.push(
            <TreeNode title={group[j].name} value={`group-${group[j].groupId}`} key={`group-${group[j].groupId}`} selectable={false}>
              {sexDOM}
            </TreeNode>
          )
        }
        res.push(
          <TreeNode title={item[i].name} value={`item-${item[i].itemId}`} key={`item-${item[i].itemId}`} selectable={false}>
            {groupDOM}
          </TreeNode>
        )
      }
    }else{
      res.push(<TreeNode title='error' key='error' />);
    }
    return res;
  };

  /*============================ 开启模态框 ============================================*/
  handleOpenDialog = () => {
    //1. 按照相应规则，过滤合法运动员
    //2. 设置如legalAthleteList中
    //3. 开启模态框
    // currentItemGroupSexID 项目ID
    const { currentItemGroupSexID, rule } = this.state;
    // 选中的运动员列表
    const { athleteList } = this.props;
    if(currentItemGroupSexID === -1 ){
      // 判断当前id是否合法
     message.warn('请先进行选择项目');
     return false;
    }

    console.log(athleteList);

    // 判断出合法的运动员列表，置入state 打开modal
    let legalAthleteList =  legalAthleteFilter(athleteList,rule);
    if(legalAthleteList.length !== 0) {
      // TODO 这里不知道会不会有bug，先给每个运动员固定一个角色，要测试轮滑求
      for(let i:number = 0; i < legalAthleteList.length ; i++) {
        legalAthleteList[i].role = 3;
      }
      this.setState({legalAthleteList: legalAthleteList, modalVisible: true});
    }else{
      message.error('队伍中不存在符合该组别条件要求人员');
    }
  };
  handleCloseDialog = () => {
    // 清空状态
    this.setState({
      modalVisible: false, 
      // legalAthleteList:[],
      teamName:'',
      // roleTypeList:[]
      selectedAthleteList: []
    })
  };  
  // table
  handleCheckboxSelect = (record:any,selected:boolean) => {
    let { selectedAthleteList } = this.state;
    let index = -1;
    for(let i:number = selectedAthleteList.length - 1 ; i >= 0 ;i-- ) {
      if(selectedAthleteList[i] === record.id) {
        index = i;
        break;
      }
    }
    if(selected && index === -1 ){
      selectedAthleteList.push(record.id);
    }else if(!selected && index!==-1){
      selectedAthleteList.splice(index,1);
    }
    this.setState({selectedAthleteList});
  };
  handleCheckSelectAll = (selected:boolean) => {
    let { selectedAthleteList,legalAthleteList } = this.state;
    if(selected) {
      // 当反选后 如果错误 执行了这个会有bug
      selectedAthleteList = legalAthleteList.map((v:any) => (v.id));
      this.setState({selectedAthleteList});
    }else if(!selected) {
      this.setState({selectedAthleteList:[]});
    }
  };
  renderExpandedRow = (record:any, index:number, indent:any, expanded:any):React.ReactNode => {
    const { member } = record;
    const { athleteList } = this.props;
    // 从props中找数据进行匹配，以获得组员的一些信息，如 性别 和 所在组别
    let sexs = new Array(member.length);
    let group_ages = new Array(member.length);
    
    for(let j:number = 0; j < member.length ; j++) {
      for(let i:number = 0; i < athleteList.length ; i++) {
        if(member[j].athlete.idcard === athleteList[i].athlete.idcard) {
          sexs[j] = athleteList[i].athlete.sex;
          group_ages[j] = athleteList[i].groupage;
          break;
        }
      }
    }
    let r:Array<React.ReactNode> = [];
    member.forEach((v:any,index:any) => {
      r.push(
        <div key={v.player}>
          <span>姓名：{v.athlete.name}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
          <span>身份证号码：{v.athlete.idcard}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
          <span>角色名称：{v.rolename}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
          <span>性别：{sexs[index]}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
          <span>所属组别：{group_ages[index]}</span>
        </div>
      )
    });
    return r;
  };
  // 处理角色设置选择
  handleRoleTypeSelect = (value:number,index:number) => {
    let { legalAthleteList } = this.state;
    legalAthleteList[index].role = value;
    this.setState({legalAthleteList});
  };

  //  处理队伍报名
  handleTeamEnroll = () => {
    const { teamName, selectedAthleteList, rule, currentItemGroupSexID, legalAthleteList } = this.state;
    const { matchId, contestantId} = this.props;
    if(teamName === "" || teamName === undefined){
      message.warn('请先填写队名');
      return;
    }
    console.log(rule);
    // 判断本单位下 该项目 组别 性别 是否已经报满

    // 判断人数是否符合
    const { maxTeamNumberLimitation, minTeamNumberLimitation} = rule;

    if(selectedAthleteList.length < minTeamNumberLimitation || selectedAthleteList.length > maxTeamNumberLimitation) {
      message.warn('队伍人数不符合报名要求');
      return;
    }

    // 判断性别 应该与生成数据一齐做
    let m:number = 0, w:number = 0;
    let player:Array<any> = [];
    selectedAthleteList.forEach((v:number) => {
      for(let i:number = legalAthleteList.length - 1; i >= 0; i--){
        if(v === legalAthleteList[i].id){
          player.push({
            player: legalAthleteList[i].player,
            roletype: legalAthleteList[i].role
          });
          if(legalAthleteList[i].athlete.sex === '男') m+=1;
          if(legalAthleteList[i].athlete.sex === '女') w+=1;
          break;
        }
      }
    });
    // 对rule中 sexType 进行性别判别
    /*
    * 全男/全女在filter中已经筛选
    * */
    const { sexType } = rule;
    if(sexType !== 1 && sexType !== 2 && sexType === 3) {
      if(sexType === 4 && (m === 0 || w === 0)) {
        message.warn('男性或女性至少存在一个');
        return;
      }
      if(sexType === 5 && (m !== 1 || w !== 1)){
        message.warn('此项目为男女混双，参赛队伍组成必须为一男一女');
      }
      // scale
      if(sexType === 6 ) {}
    }
    //
    // 报名
    let reqData = {
      name: teamName,
      matchdata: matchId,
      contestant: contestantId,
      openprojectgroupsex:currentItemGroupSexID,
      player
    };
    teamEnroll(reqData).then((res:any) => {
      if(res) {
        message.success('报名成功');
        this.props.dispatch({
          type: 'enroll/checkIsEnrollAndGetAthleteLIST',
          payload: {
            matchId : this.props.matchId,
            unitId : this.props.unitId
          }
        })
      }else {
        message.error('报名失败');
      }
      this.setState({
        modalVisible: false,
        // legalAthleteList:[],
        teamName:'',
        // roleTypeList:[],
        // 因为清空这个，在前端界面中并没有清除选项，所以先不清空
        selectedAthleteList:[]
      });
    });
  };
  // 删除
  handleDeleteTeamEnroll = (id:number) => {
    const { matchId, unitId, dispatch } = this.props;
    for(let i:number = 0;i < this.props.teamEnroll.length; i++) {
      if(this.props.teamEnroll[i].id === id) {
        id = this.props.teamEnroll[i].member[0].teamenroll;
        break;
      }
    }
    deleteTeam({teamenroll: id}).then(data => {
      if(data) {
        dispatch({ type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: { matchId, unitId } 
      });
        message.success('删除成功');
      }else {
        message.error('删除失败！');
        console.log(data);
      }
    })
  };
  
  
  render(): React.ReactNode {
    const { teamItem, teamEnroll } = this.props;
    const { modalVisible, legalAthleteList, roleTypeList, selectedAthleteList } = this.state;

    let TREE_NODE = this.initialTreeDOM(teamItem);

    const modalProps: ModalProps = {
      visible: modalVisible,
      footer:false,
      title: '选择队员进行团队报名',
      onCancel:this.handleCloseDialog,
      width: '80%'
    };
    // 报名栏table
    const tableColumns = [
      { title: '名称', key:'name',dataIndex: 'athlete',
        render:(text:any) => (<div key={text.id}><span>{text.name}</span></div>)
      },
      { title: '选择角色', dataIndex:'role', key:'role',
        render:(text:any,_:any,index:number) => (
          <Select defaultValue={roleTypeList.length === 0 ? '' : roleTypeList[0].cn_name} style={{width: '120px'}} onChange={(value:number) => this.handleRoleTypeSelect(value,index)}>
            {
              roleTypeList.length !== 0
                ? roleTypeList.map((v:any) => (<Option value={v.id} key={v.id}>{v['cn_name']}</Option>))
                : <Option value={-1}>无数据</Option>
            }
          </Select>
        )
      },
    ];
    const rowSelection:TableRowSelection<any> = {
      fixed:true,
      onSelect:this.handleCheckboxSelect,
      onSelectAll:this.handleCheckSelectAll,
      selectedRowKeys: selectedAthleteList,
    };

    // showTable
    const showTableColumns = [
      { title: '项目-组别-性别', dataIndex: 'itemGroupSexName', key: 'itemGroupSexName'},
      { title: '队伍名称', dataIndex: 'teamName', key: 'teamName'},
      { title: '删除', key:'del',dataIndex: 'id',
        render:(text:number) => (<a onClick={() => this.handleDeleteTeamEnroll(text)}>删除</a>)
      }
    ];



    return (
      <div>
        <div>
          <TreeSelect style={{width: '300px'}} placeholder='请选择团队项目' onChange={this.handleTreeSelectChange}>
            {TREE_NODE}
          </TreeSelect>
          <Button onClick={this.handleOpenDialog}>开设新队伍</Button>
        </div>
        <div className={styles['myroll']}>
          <Table
            style={{height:'200%'}}
            dataSource={teamEnroll}
            columns={showTableColumns}
            expandedRowRender={this.renderExpandedRow}
            rowKey={(record:any) => record.id}
          />
          <Button type="primary" style={{marginTop:20,float:"right"}} onClick={() => {router.goBack()}} >返回个人报名</Button>
        
        </div>
        <Modal {...modalProps}>
          <Input
            placeholder='请输入队伍名称'
            value={this.state.teamName}
            onChange={(e:any) => this.setState({teamName:e.target.value})}
          />
          <Table
            columns={tableColumns}
            dataSource={legalAthleteList}
            rowSelection={rowSelection}
            rowKey={(record:any) => (record.id)}
          />
          <Button style={{width: '100%'}} onClick={this.handleTeamEnroll}>确认报名</Button>
        </Modal>
      </div>
    );
  }
}

export default connect(({enroll}:any) => {
  const { teamItem } = enroll;
  return {
    teamItem:teamItem,
    matchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    contestantId: enroll.unit.contestantUnitData.id,
    // 这里暂时这样写 - roletype 是number
    athleteList: enroll.unit.athleteList.map((v:any) => ({...v,role:""})),
    individualLimitation: enroll.individualLimitation,
    teamEnroll: enroll.unit.teamEnrollList
  };
})(TeamEnroll)
