import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Modal, Table, Select, message, Button, Tag} from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { ColumnProps } from 'antd/lib/table';
import { getListByKey, getGroupsByAge, getLegalSexList } from '@/utils/enroll';
import { deleteIndividualEnroll, individualEnroll } from '@/services/enroll';
// @ts-ignore
import styles from './index.less';

const { Option } = Select;

/*
 * 1。前端不检查 项目下 单位 可报名 人（队） 限制
 */

class IndividualEnroll extends React.Component<any,any>{
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
      // 运动员信息
      currentAthleteData: {},
      // 筛选的列表
      groupList: [],
      sexList: [],
      itemGroupSexID:-1,
      groupValue: undefined,
      sexValue: undefined,
      itemValue: undefined
    }
  }

  componentDidMount(): void {
    const { matchId, unitId, dispatch } = this.props;
    if(matchId && unitId){
      dispatch({ type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: { matchId, unitId } })
    }
  }
  // 更新时重新获取
  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
    const { matchId, unitId, dispatch } = this.props;
    if( matchId && unitId && (unitId !== prevProps.unitId || matchId !== prevProps.matchId) ) {
      //
      dispatch({ type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: { matchId, unitId } })
    }
  }

  // 选中运动员进行报名
  selectIndividualEnroll = (record:any) => {
    this.setState({
      currentAthleteData:record,
      modalVisible: true,
      itemGroupSexID: -1
    })
  };
  // 个人报名
  handleIndividualEnroll = (athleteData: any, id: number) => {
    const { dispatch, matchId, unitId } = this.props;
    if(id !== -1) {
      // 加多一个前端的个人报名判断
      /*
      * 1、检查是否存在相同的项目
      * */

      let enrollData = { player:athleteData.player, openprojectgroupsex:id };
      individualEnroll(enrollData).then(data => {
        if(data) {
          dispatch({type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload:{matchId,unitId}});
          message.success('报名成功');
          this.setState({
            modalVisible:false,
            groupList:[], sexList: [], itemGroupSexID: -1,
            groupValue:undefined, sexValue:undefined, itemValue:undefined
          })
        }
      })
    }
  };
  // 删除个人报名
  handleCloseEnroll = (id:number) => {
    console.log(id);
    const { dispatch,matchId,unitId } = this.props;
    deleteIndividualEnroll({personalprojectenroll:id})
      .then(data => {
        if(data) {
          dispatch({ type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: { matchId, unitId } })
        }
      })
  };

  /*============================ 选择项目 ============================================*/
  // 选中项目后判断组别
  /*
  * athleteData - 当前运动员信息
  * itemList - 个人项目列表
  * itemId - 选中输入的id
  * limitation - 限制条件
  * */
  getGroupByItem = (athleteData:any, itemList: Array<any>, itemId: number, limitation:any) => {
    this.setState({itemValue:itemId});
    if(itemId) {
      // 清空下面的设置
      this.setState({groupValue: undefined, sexValue: undefined,sexList: [], itemGroupSexID: -1});
      // 拿出运动员出生日期
      const birthday = athleteData.athlete.birthday.slice(0,10);
      // 若没有相应组别 则返回false
      let groupList = getListByKey(itemList,itemId,'itemId') ? getListByKey(itemList,itemId,'itemId').groupData : false ;
      // 存在可用组别信息
      if(groupList) {
        const { upGroupNumber } = limitation;
        // 通过 年龄+组别列表+可升组数量 得到可选组别列表
        let r = getGroupsByAge(birthday,groupList,upGroupNumber);
        // 设置组别列表
        this.setState({groupList: r});
      }else {
        message.warn('此项目没有适合该名运动员的组别');
        this.setState({groupList: []});
      }
    }else{
      this.setState({groupList: [], sexList: [], itemGroupSexID: -1});
    }
  };
  // 选中组别后 判别
  /*
  * athleteData - 运动员信息
  * groupList - 当前可选组别列表
  * groupId   - 选中组别列表
  * */
  getSexByGroup = (athleteData:any, groupList: Array<any>, groupId: number) => {
    const { sex } = athleteData.athlete;
    let sexList = getListByKey(groupList, groupId, 'groupId') ? getListByKey(groupList, groupId, 'groupId').sexData : false ;
    if(sexList && sexList.length !== 0) {
      let r = getLegalSexList(sex,sexList);
      this.setState({sexList:r, groupValue:groupId, itemGroupSexID:-1});
    }else {
      message.warn('没有开设符合您的性别组别');
      this.setState({sexList: [], itemGroupSexID: -1});
    }
  };


  render(): React.ReactNode {
    const { modalVisible, currentAthleteData , groupList, sexList, itemGroupSexID, groupValue, sexValue, itemValue } = this.state;
    const { enrollAthleteList, individualItemList, individualLimitation } = this.props;
    const modalProps: ModalProps = {
      visible: modalVisible,
      title: '添加个人报名信息',
      onCancel:() => this.setState({modalVisible: false, groupList:[], sexList: [], itemGroupSexID: -1, groupValue: undefined, sexValue: undefined,itemValue:undefined}),
      footer:false,
      width: '500px'
    };
    const tableColumns: Array<ColumnProps<any>> = [
      { title: '姓名', key: 'name', render:(_:any,record:any) => (<span>{record.athlete.name}</span>),align: 'center'},
      { title: '证件号', key: 'identifyNumber', render:(_:any,record:any) => (<span>{record.athlete.idcard}</span>),align: 'center'},
      { title: '出生日期', key: 'birthday', render:(_:any,record:any) => (<span>{record.athlete.birthday.slice(0,10)}</span>),align: 'center'},
      { title: '所属组别', key: 'group', dataIndex: 'groupage',align: 'center'},
      {
        title: '未升组项目', key: 'enrolledItem', dataIndex: 'project',align: 'center',
        render:(text:any):React.ReactNode => {
          const { personaldata } = text;
          return (
            <div style={{fontSize: '10px'}}>
              {personaldata.length !== 0 ? personaldata.map((v:any) => (<p key={v.id}><span>{v.name}</span></p>)) : <span key={Math.random()}>--</span>}
            </div>
          )
        }
      },
      {
        title: '升组项目', key: 'enrolledUploadItem', dataIndex: 'project',align: 'center',
        render:(text:any):React.ReactNode => {
          const { upgrouppersonaldata } = text;
          return (
            <div style={{fontSize: '10px'}}>
              {upgrouppersonaldata.length !== 0 ?upgrouppersonaldata.map((v:any) => (<p key={v.id}><span>{v.name}</span></p>)) : <span key={Math.random()}>--</span>}
            </div>
          )
        }
      },
      {
        title: '操作', key: 'h',align: 'center',
        render: (_: any, record: any): React.ReactNode => (<a onClick={() => this.selectIndividualEnroll(record)}>报名</a>)
      },
    ];

    return (
      <div className={styles['individual-enroll']}>
        {/* rule-block */}
        <div className={styles['rule-block']} />
        <div className={styles['table-block']}>
          <Table dataSource={enrollAthleteList} columns={tableColumns} rowKey={record => record.id}/>
        </div>
        <Modal {...modalProps}>
          <div className={styles['enroll-block']}>
            <Select
              style={{width: '100%', marginBottom: '10px'}}
              onChange={(value:number) => this.getGroupByItem(currentAthleteData, individualItemList, value, individualLimitation)}
              placeholder='请选择项目'
              value={itemValue}
            >
              {individualItemList.map((v:any) => (<Option key={`item-${v.itemId}`} value={v.itemId}>{v.name}</Option>))}
            </Select>

            <Select
              style={{width: '100%', marginBottom: '10px'}}
              onChange={(value:number) => this.getSexByGroup(currentAthleteData, groupList, value)}
              disabled={groupList.length===0}
              placeholder='请选择组别'
              value={groupValue}
            >
              {
                groupList.length === 0
                ? null
                : groupList.map((v:any) => (<Option value={v.groupId} key={v.groupId}>{v.name}</Option>))
              }
            </Select>

            <Select
              style={{width: '100%', marginBottom: '10px'}}
              onChange={(value) => this.setState({sexValue:value,itemGroupSexID:value})}
              disabled={sexList.length===0}
              placeholder='请选择性别组别'
              value={sexValue}
            >
              {
                sexList.length === 0
                ? null
                : sexList.map((v:any) => (<Option value={v.sexId} key={v.sexId}>{v.name}</Option>))
              }
            </Select>

            <Button
              type='primary'
              onClick={() => this.handleIndividualEnroll(currentAthleteData, itemGroupSexID)}
            >
              添加报名项目
            </Button>
          </div>
          <hr/>
          <div className={styles['tag-block']}>
            {
              Object.keys(currentAthleteData).length !== 0  ? (
                <div>
                  <div>
                    原年龄所属组别参赛：
                    {
                      currentAthleteData.project.personaldata.length !== 0
                      ? currentAthleteData.project.personaldata.map((v:any) => (<Tag key={v.id} closable={true} onClose={() => this.handleCloseEnroll(v.id)} >{v.name}</Tag>))
                        : <span>无</span>
                    }
                  </div>
                  <div>
                    升组组别参赛：
                    {
                      currentAthleteData.project.upgrouppersonaldata.length !== 0
                        ? currentAthleteData.project.upgrouppersonaldata.map((v:any) => (<Tag key={v.id} closable={true} onClose={() => this.handleCloseEnroll(v.id)}>{v.name}</Tag>))
                        : <span>无</span>
                    }
                  </div>
                </div>
              ): (<span>无</span>)
            }
          </div>
        </Modal>
        <div>
          <Button
            onClick={() => router.push('/enroll/team')}
            type='primary'
            style={{width: '160px'}}
          >
            进入团队报名
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(({enroll}:any) => {
  return {
    enrollAthleteList:enroll.unit.athleteList.filter((v:any) => {
      return v.active === 1;
    }),
    matchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    individualItemList: enroll.individualItem,
    individualLimitation: enroll.individualLimitation
  }
})(IndividualEnroll);
