import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Select, Row, Col, TreeSelect, message, Button, Tag} from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { getListByKey, getGroupsByAge, getLegalSexList } from '@/utils/enroll';
import { deleteIndividualEnroll } from '@/services/enroll';
// @ts-ignore
import styles from './index.less';

const { Option } = Select;
const { TreeNode } = TreeSelect;

/*
 * 1。前端不检查 项目下 单位 可报名 人（队） 限制
 */

class IndividualEnroll extends React.Component<any,any>{
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
      currentAthleteData: {},
      groupList: [],
      sexList: []
    }
  }

  componentDidMount(): void {}

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
    const { matchId, unitId, dispatch } = this.props;
    console.log(matchId, unitId);
    if( matchId && unitId && (unitId !== prevProps.unitId || matchId !== prevProps.matchId) ) {
      //
      dispatch({
        type: 'enroll/checkIsEnrollAndGetAthleteLIST',
        payload: { matchId, unitId }
      })
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
    const { dispatch } = this.props;
    dispatch({
      type: 'enroll/individualEnroll',
      payload: {
        enrollData:{
          player:athleteData.player,
          openprojectgroupsex:id
        }
      }
    })
  };

  handleCloseEnroll = (id:number) => {
    console.log(id);
    deleteIndividualEnroll({personalprojectenroll:id})
      .then(res => {
        console.log(res);
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
    if(itemId) {
      // 拿出运动员出生日期
      const birthday = athleteData.athlete.birthday.slice(0,10);
      // 若没有相应组别 则返回false
      let groupList = getListByKey(itemList,itemId,'itemId') ? getListByKey(itemList,itemId,'itemId').groupData : false ;
      // 存在可用组别信息
      if(groupList) {
        const { upGroupNumber } = limitation;
        //
        let r = getGroupsByAge(birthday,groupList,upGroupNumber);
        this.setState({groupList: r});
      }else {
        message.warn('此项目没有适合该名运动员的组别');
      }
    }else{
      this.setState({groupList: []});
    }
  };
  // 选中组别后 判别
  getSexByGroup = (athleteData:any, groupList: Array<any>, groupId: number) => {
    const { sex } = athleteData.athlete;
    let sexList = getListByKey(groupList, groupId, 'groupId') ? getListByKey(groupList, groupId, 'groupId').sexData : false ;
    if(sexList && sexList.length !== 0) {
      let r = getLegalSexList(sex,sexList);
      this.setState({sexList:r});
    }else {
      this.setState({sexList: []});
    }
  };
  /*============================ TreeSelect ============================================*/
  //
  handleTreeSelectChange = (value: any, label: any, extra: any) => {
    console.log(value);
    console.log(label);
    console.log(extra);
  };
  // 初始化树桩选择器dom
  initialTreeDOM = (item:Array<any>):React.ReactNode => {
    let res:Array<React.ReactNode> = [];
    if(item) {
      for(let i:number = item.length - 1 ; i >= 0 ; i--) {
        let groupDOM: Array<React.ReactNode> = [];
        const group = item[i].groupData;
        for(let j:number = group.length - 1 ; j >= 0 ; j--) {
          const sex = group[i].sexData;
          let sexDOM:Array<React.ReactNode> = [];
          for(let k:number = sex.length - 1 ; k >= 0 ; k--) {
            sexDOM.push(
              <TreeNode
                title={`${item[i].name}-${group[j].name}-${sex[k].name}`}
                value={`${item[i].itemId}-${group[j].groupId}-${sex[k].sexId}`}
                key={`sex-${sex[k].sexId}`}
              />)
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

  render(): React.ReactNode {
    const { modalVisible, currentAthleteData , groupList, sexList, itemGroupSexID } = this.state;
    const { enrollAthleteList, individualItemList, individualLimitation } = this.props;

    const modalProps: ModalProps = {
      visible: modalVisible,
      title: '添加个人报名信息',
      onCancel:() => this.setState({modalVisible: false}),
      footer:false
    };
    const tableColumns = [
      { title: '姓名', key: 'name', render:(_:any,record:any) => (<span>{record.athlete.name}</span>)},
      { title: '证件号', key: 'identifyNumber', render:(_:any,record:any) => (<span>{record.athlete.idcard}</span>)},
      { title: '出生日期', key: 'birthday', render:(_:any,record:any) => (<span>{record.athlete.birthday.slice(0,10)}</span>)},
      { title: '所属组别', key: 'group', dataIndex: 'groupage'},
      {
        title: '已报项目', key: 'enrolledItem', dataIndex: 'project',
        render:(text:any):React.ReactNode => {
          const { personaldata, upgrouppersonaldata } = text;
          return (
            <div style={{fontSize: '10px'}}>
              <p><span>未升组项目:</span>{personaldata.length !== 0 ? personaldata.map((v:any) => (<span key={v.id}>{v.name}</span>)) : <span>尚未有报名项目</span>}</p>
              <p><span>升组项目:</span>{upgrouppersonaldata.length !== 0 ?upgrouppersonaldata.map((v:any) => (<span key={v.id}>{v.name}</span>)) : <span>尚未有报名项目</span>}</p>
            </div>
          )
        }
      },
      {
        title: '操作', key: 'h',
        render: (_: any, record: any): React.ReactNode => (<a onClick={() => this.selectIndividualEnroll(record)}>报名</a>)
      },
    ];

    // 生成树的dom
    // let TREE_DOM:React.ReactNode = this.initialTreeDOM(individualItemList);

    return (
      <div className={styles['individual-enroll']}>
        {/* rule-block */}
        <div className={styles['rule-block']} />
        <div className={styles['table-block']}>
          <Table dataSource={enrollAthleteList} columns={tableColumns} rowKey={record => record.id}/>
        </div>
        <Modal {...modalProps}>
          <div className={styles['enroll-block']}>
            {/* 项目 */}
            <Row>
              <Col span={6}>请选择项目:</Col>
              <Col span={18}>
                <Select style={{width: '80%'}} onChange={(value:number) => this.getGroupByItem(currentAthleteData, individualItemList, value, individualLimitation)}>
                  {individualItemList.map((v:any) => {
                    return <Option key={`item-${v.itemId}`} value={v.itemId}>{v.name}</Option>
                  })}
                </Select>
              </Col>
            </Row>
            {/* 组别 */}
            <Row>
              <Col span={6}>请选择组别:</Col>
              <Col span={18}>
                <Select
                  style={{width: '80%'}}
                  onChange={(value:number) => this.getSexByGroup(currentAthleteData, groupList, value)}
                  disabled={groupList.length===0}
                >
                  {
                    groupList.length === 0 ? null :
                      groupList.map((v:any) => {
                        return <Option value={v.groupId} key={v.groupId}>{v.name}</Option>
                      })
                  }
                </Select>
              </Col>
            </Row>
            {/* 性别 */}
            <Row>
              <Col span={6}>请选择性别组别:</Col>
              <Col span={18}>
                <Select
                  style={{width: '80%'}}
                  onChange={(value) => this.setState({itemGroupSexID:value})}
                  disabled={sexList.length===0}
                >
                  {
                    sexList.length === 0 ? null :
                      sexList.map((v:any) => {
                        return <Option value={v.sexId} key={v.sexId}>{v.name}</Option>
                      })
                  }
                </Select>
              </Col>
            </Row>
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
