import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Modal, Table, Select, message, Button, Tag, Checkbox, Input, notification} from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { ColumnProps } from 'antd/lib/table';
import { getListByKey, getGroupsByAge, getLegalSexList } from '@/utils/enroll';
import { deleteIndividualEnroll, individualEnroll, submitCertificationNumber } from '@/services/enroll';
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
      noticeVisible: true,
      // 运动员信息
      currentAthleteData: {},
      athleteName: '',
      // 筛选的列表
      groupList: [],
      sexList: [],
      itemGroupSexID:-1,
      groupValue: undefined,
      sexValue: undefined,
      itemValue: undefined,
      isUpGroup: false,
      // 输入证书的modal框、证书号码
      cModalVisible: false,
      certificationNumber: "",
      // 个人运动员信息
      person_data: []
    }
  }

  componentDidMount(): void {
    const { matchId, unitId, dispatch, noticeVisbile } = this.props;
    if(matchId && unitId){
      dispatch({ type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: { matchId, unitId } })
      if(noticeVisbile && matchId == 14){
        notification.info({
          description: '速度过桩淘汰赛不算入个人总项目数，若参加速度过桩个人赛后需报名淘汰赛请自行报名',
          message: '系统更新通知'
        })
        dispatch({type: 'enroll/modifyNoticeVisible', payload: {}})
      }
      if(noticeVisbile && matchId == 13){
        notification.info({
          description: '少年甲、乙、丙组参赛运动员若获得《广东省轮滑技术水平的等级测试》单排轮滑球项目中级一星（含）以上等级，则允许在其规定年龄段中往上跨一个组别进行参赛。青年组升组至成年组，则不需要该业余等级证',
          message: '系统更新通知',
        })
        dispatch({type: 'enroll/modifyNoticeVisible', payload: {}})
      }
    }
    // TODO 待确认 因为升组项目这些信息，这里面没有，看看怎么弄
    // if(person_data.id !== undefined && unit_account !== undefined){
    //   this.setState({person_data: [{

    //   }]})
    // }
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
    // console.log(record);
    this.setState({
      currentAthleteData:record,
      modalVisible: true,
      itemGroupSexID: -1,
      athleteName: record.athlete.name
    })
  };
  // 个人报名
  handleIndividualEnroll = (athleteData: any, id: number) => {
    const { dispatch, matchId, unitId, individualItemList } = this.props;
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
          // 用for 加多一个提示样式，说淘汰赛不算入总项目
          for(let i = 0; i < individualItemList.length; i++){
            if(individualItemList[i].name == '速度过桩个人赛'){
              for(let j = 0; j < individualItemList[i].groupData.length; j++){
                if(individualItemList[i].groupData[j].groupId == id){
                  message.info('如需报名速度过桩淘汰赛请自行报名，不算入个人总项目数');
                  break;
                }
              }
              break;
            }
          }
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
    const { dispatch,matchId,unitId } = this.props;
    deleteIndividualEnroll({personalprojectenroll:id})
      .then(data => {
        if(data) {
          dispatch({ type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: { matchId, unitId } })
          message.success('删除个人报名项目成功');
        }
      })
  };

  /*============================ 选择项目 ============================================*/
  // 选中项目后判断组别
  /*
  * athleteData - 当前运动员信息
  * itemList - 个人项目列表
  * itemId - 选中输入的id
  * limitation - 限制条件，里面有isCrossGroup(boolean)，upGroupNumber(number)，itemLimitation(number)
  * */
  getGroupByItem = (athleteData:any, itemList: Array<any>, itemId: number, limitation:any) => {
    // isCrossGroup 是个boolean
    const { isCrossGroup, upGroupNumber } = this.props.individualLimitation;
    const { matchId } = this.props;
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
        // 通过 年龄+组别列表+可升组数量 得到可选组别列表，例如可选青成组，少年组
        let r = getGroupsByAge(birthday,groupList,upGroupNumber,matchId);
        let fGroupList = [],fGroupValue = -1;
        if(r.length !== 0) {
          // 判断是否可以跨组别参赛
          if(isCrossGroup) {
            // 可以跨组
            // 将其原组别设置（位于数组最后一个）进入itemValue，但禁用选择框
            fGroupList = r; fGroupValue = r[r.length - 1].groupId;
          }else {
            // 不可以跨组
            // r的最后一项为原组别
            if(athleteData.project.upgrouppersonaldata.length !== 0) {
              // 已报名升组项目
              // 将前一个组别设置
              fGroupList = r;
              if(r.length === 1) {
                fGroupValue = r[0].groupId;
              }else {
                fGroupValue = r[r.length - 2].groupId;
              }
            }else if(athleteData.project.personaldata.length !== 0) {
              // 已报名原本组别项目
              // console.log(2);
              fGroupList = r; fGroupValue = r[r.length - 1].groupId;
            } else if(athleteData.project.hasOwnProperty('teamproject')) {
              // 判断 是否 有团队报名项目
              // 不能从个人项目中判断组别，去查看团体项目
              if(athleteData.project.teamproject.length === 0) {
                // 没有报团队项目
                fGroupList = r; fGroupValue = r[r.length - 1].groupId;
              }else{
                let isUpGroup:boolean = false;
                for(let i:number = athleteData.project.teamproject.length - 1 ; i >= 0; i--) {
                  if(athleteData.project.teamproject[i].isUpGroup) {
                    // 报了升组的项目
                    isUpGroup = true; break;
                  }
                }
                // FIXME 暂时不解决跨组的问题
                if(isUpGroup) {
                  //
                  fGroupList = r; fGroupValue = r[r.length - 2].groupId;
                }else {
                  fGroupList = r; fGroupValue = r[r.length - 1].groupId;
                }
              }
            } else {
              // 什么项目没有报名
              fGroupList = r; fGroupValue = r[r.length - 1].groupId;
            }
            //
          }
        }
        this.setState({ groupList: fGroupList, groupValue: fGroupValue});
        this.getSexByGroup(athleteData, fGroupList, fGroupValue);
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
      this.setState({sexList:r, groupValue:groupId, itemGroupSexID: r === false ? -1 : r[0].sexId, sexValue:r === false ? undefined : r[0].name});
    }else {
      message.warn('没有开设符合您的性别组别');
      this.setState({sexList: [], itemGroupSexID: -1});
    }
  };
  // 选中升组
  handleIsUpGroup = (e: any) => {
    const { groupList }  = this.state;
    const { checked } = e.target;

    if(checked) {
      // 如果选中，筛选组别信息
      this.setState({ groupValue: groupList[groupList.length - 2].groupId, isUpGroup: true });
    }else {
      this.setState({ groupValue: groupList[groupList.length - 1].groupId, isUpGroup: false });
    }
  };

  // 提交业余等级编号证书
  submitCertificationNumber = () => {
    // 默认将state中的提交
    const { certificationNumber, currentAthleteData, itemValue } = this.state;
    const { matchId } = this.props;
    submitCertificationNumber({
      certification_code: certificationNumber,
      athlete_id: currentAthleteData.athlete.id,
      openproject_id: itemValue,
      matchdata_id: matchId
    })
      .then(data => {
        if(data) {
          message.success('提交成功,直接按原组别报名即可');
          this.setState({
            cModalVisible: false
            // 这里暂时不知道需要需要获取
          })
        }
      })
  };

  // 渲染升组请求文字
  static renderCertificationBtnText(certificationCode: string):React.ReactNode {
    if(certificationCode === "") {
      return <span>请添加业余等级证书</span>
    }else if(certificationCode === "-1") {
      return <span>请重新添加业余等级证书</span>
    }else if(certificationCode === "1"){
      return <span>审核中</span>
    }else {
      return <span>已通过</span>
    }
  }

  render(): React.ReactNode {
    const { modalVisible, currentAthleteData , groupList, sexList, itemGroupSexID, groupValue, sexValue, itemValue, isUpGroup, cModalVisible } = this.state;
    const { matchId, enrollAthleteList, individualItemList, individualLimitation } = this.props;
    const modalProps: ModalProps = {
      visible: modalVisible,
      title:  this.state.athleteName === '' ? 1 : this.state.athleteName +'   请选择报名项目进行报名',
      onCancel:() => this.setState({modalVisible: false, groupList:[], sexList: [], itemGroupSexID: -1, groupValue: undefined, sexValue: undefined,itemValue:undefined}),
      footer:false,
      width: '100%'
    };
    const tableColumns: Array<ColumnProps<any>> = [
      { title: '姓名', key: 'name', render:(_:any,record:any) => (<span>{record.athlete.name}</span>),align: 'center', fixed: 'left',width: 100},
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
        title: '升组项目', key: 'enrolledUploadItem', dataIndex: 'project',align: 'center',width: 200,
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
        title: '操作', key: 'h',align: 'center',fixed: 'right',width: 100,
        render: (_: any, record: any): React.ReactNode => (<a onClick={() => this.selectIndividualEnroll(record)}>报名</a>)
      },
    ];

    return (
      <div className={styles['individual-enroll']}>
        {/* rule-block */}
        <div className={styles['rule-block']} />
        <div className={styles['table-block']}>
          <Table dataSource={enrollAthleteList} columns={tableColumns} rowKey={record => record.id} scroll={{ x: 940}} />
        </div>
        {/* 报名modal */}
        <Modal {...modalProps} style={{top: '0'}}>
          <div className={styles['enroll-block']}>
            <div className={styles['r']}>
              <Select
                onChange={(value:number) => this.getGroupByItem(currentAthleteData, individualItemList, value, individualLimitation)}
                placeholder='请选择项目'
                value={itemValue}
              >
                {individualItemList.map((v:any) => (<Option key={`item-${v.itemId}`} value={v.itemId}>{v.name}</Option>))}
              </Select>
              <div>
                <span>升组请勾选</span>
                <Checkbox
                  checked={isUpGroup}
                  onChange={this.handleIsUpGroup}
                  // 禁用升组选择
                  /*
                  * 1、升组数量为0
                  * 2、未选中item
                  * 3、没有任何符合组别
                  *
                  * */
                  disabled={individualLimitation.upGroupNumber === 0 || itemValue === undefined || groupList.length === 0 || currentAthleteData['certification_code'] === "" || currentAthleteData['certification_code'] === "-1" || currentAthleteData['certification_code'] === "1"}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                  onClick={() => {this.setState({cModalVisible: true});}}
                  type="primary"
                  disabled={!(currentAthleteData['certification_code'] === "" || currentAthleteData['certification_code'] === "-1") && itemValue !== undefined}
                >
                  {IndividualEnroll.renderCertificationBtnText(currentAthleteData['certification_code'])}
                </Button>
              </div>
            </div>

            <div className={styles.r}>
              <Select
                onChange={(value:number) => this.getSexByGroup(currentAthleteData, groupList, value)}
                // 只有升组可升两组才可以选择
                disabled={
                  matchId === 12 ? individualLimitation.upGroupNumber <= 1 && groupList.length < 2
                  : individualLimitation.upGroupNumber <= 1
                }
                placeholder='请选择组别'
                value={groupValue}
              >
                {
                  groupList.length === 0
                  ? null
                  : groupList.map((v:any) => (<Option value={v.groupId} key={v.groupId}>{v.name}</Option>))
                }
                <Option value={-1} key={-1}>无可选组别</Option>
              </Select>
              <Select
                onChange={(value:any) => this.setState({sexValue:value,itemGroupSexID:value})}
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
              <br />
              <span style={{color:'red',marginLeft:'43%'}}>请选择参赛性别组别</span>
            </div>
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
        {/* 填写证书modal */}
        <Modal
          visible={cModalVisible}
          onCancel={() => this.setState({cModalVisible: false, certificationNumber: ""})}
          onOk={this.submitCertificationNumber}
          title="请输入你的业余证书编号"
        >
          <Input onChange={(e:any) => this.setState({certificationNumber: e.target.value})}/>
          <p>
            <span>请输入真实的证书编号，待校验后会将您所选组别调节为升组</span>
          </p>
        </Modal>
        <div>
          <Button
            onClick={() => router.push('/enroll/team')}
            type='primary'
            style={{width: '160px'}}
          >
            下一步:团队项目报名
          </Button>
          <Button type="primary" style={{float:'right'}} onClick={() => router.goBack()} >
            返回
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(({enroll, user}:any) => {
  let reverse_athlete:any[] = [...enroll.unit.athleteList].reverse();
  return {
    enrollAthleteList:reverse_athlete.filter((v:any) => {
      return v.active === 1;
    }),
    matchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    individualItemList: enroll.individualItem,
    individualLimitation: enroll.individualLimitation,
    unit_account: user.unitAccount,
    person_data: user.athleteData[0],
    noticeVisible: enroll.noticeVisbile
  }
})(IndividualEnroll);
