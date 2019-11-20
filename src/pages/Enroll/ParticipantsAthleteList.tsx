import React, { useEffect, useState } from 'react';
import { Form, Upload, Table, Input, Button, Modal, message, Select, DatePicker, Checkbox, Spin, Icon } from 'antd';
import moment, { Moment } from 'moment';
import AddressInput from '@/components/AddressInput/AddressInput';
import { connect } from 'dva';
import router from 'umi/router';

import { UploadChangeParam } from 'antd/lib/upload';
import { FormComponentProps, FormProps, ValidateCallback } from 'antd/lib/form';
import { ModalProps } from 'antd/lib/modal';

import { newUnitAthlete, deleteAthlete, addParticipantsAthlete, deleteParticipantsAthlete } from '@/services/enroll.ts';
import { updatePlayer} from '@/services/athlete';
import { checkPhoneNumber, checkEmail, checkIDCard } from '@/utils/regulars';

// @ts-ignore
import styles from './index.less';
import { Dispatch } from 'redux';
import { ColumnProps } from 'antd/es/table';
import { ConnectState } from '@/models/connect';
const { Option } = Select;
const { Item } = Form;

// 样式
const formStyle: FormProps = {
  layout: 'horizontal',
  labelCol: {span: 4},
  wrapperCol: {span: 20},
  colon: true,
  labelAlign: 'right'
};
//
interface AthleteInfoFormProps extends FormComponentProps{
  emitData:(data:object) => void;
  // 暂时定为any
  currentAthleteData: any;
}

interface athleteListProps {
  key: string;
  id: string;
  name?: string;
  active?: any;
  identifyID?: string;
  sex?: string;
  birthday?: string;
  phone?: string;
  emergencyContact?: string | null;
  emergencyContactPhone?: string | null;
  handle?: React.ReactNode;
}

// 转base64
function getBase64 (file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class AthleteInfoForm extends React.Component<AthleteInfoFormProps, any> {

  constructor(props: AthleteInfoFormProps) {
    super(props);
    this.state = {
      // 拿到个人上传的照片后 需要 放入 fileList中即可以查看
      // {uid:-1,url: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'}
      fileList: [],
      previewImage: '',
      previewVisible: false,
      // 是否 选中使用身份证
      isIDCard:true,
      input_disabled:false,
    }
  }

  componentDidUpdate(prevProps: Readonly<AthleteInfoFormProps>, prevState: Readonly<any>, snapshot?: any): void {
    const pC =  prevProps.currentAthleteData;
    const tC = this.props.currentAthleteData;

    // 两次都是新建，在不增加传承的情况下暂时无法情况upload
    if(pC && !tC) {
      // 上-有运动员信息 现-没有运动员信息
      this.setState({fileList:[],input_disabled:false});
    }else if(!pC && tC) {
      // 上-没有运动员信息 现-有&&运动员信息中已经上传了图片
      if(tC.athlete.face !== null && tC.athlete.face !== undefined) {
        this.setState({fileList:[{uid: -1,url:tC.athlete.face}],input_disabled:true});
      }else {
        this.setState({fileList:[],input_disabled:true});
      }
    }
  }

  componentDidMount() {
    // 加这个是为了第一次点击修改运动员时触发disabled，因为componentDidUpdate只在之后触发
    const tC = this.props.currentAthleteData;
    if(this.props.currentAthleteData !== undefined && this.props.currentAthleteData != {}) {
      if(tC.athlete !== undefined) {
        if(tC.athlete.face !== null && tC.athlete.face !== undefined) {
          this.setState({fileList:[{uid: -1,url:tC.athlete.face}],input_disabled:true});
        }else {
          this.setState({fileList:[],input_disabled:true});
        }
      }
    }
  }

  /* =====================表单动态修改=========================== */

  // 处理填写身份证事件
  handleIDCardChange = (rule: any, value: any, callback: Function) => {
    const { isIDCard } = this.state;
    const { setFieldsValue } = this.props.form;
    // 证件类型为身份证
    if(!isIDCard || value === undefined){
      callback(); return;
    }
    // 长度是否为18
    if(value.length !== 18) {
      callback("请输入正确的身份证号"); return;
    }
    if(checkIDCard.test(value) && isIDCard){
      const birthday = `${value.slice(6,10)}${value.slice(10,12)}${value.slice(12,14)}`;
      setFieldsValue({
        sex: value.slice(-2,-1)%2 === 1 ? '男' : '女',
        birthday: moment(birthday)
      });
      callback(); return;
    }
    callback('请输入正确的身份证号');
    return;
  };
  // 判断当前证件类型是否为身份证
  handlerCertificationTypeChange = (value: string) => {
    const ID_CARD_TEST = '身份证';
    if(value === ID_CARD_TEST){
      this.setState({isIDCard:true});
    }else{
      this.setState({isIDCard:false});
    }
    this.props.form.resetFields(['certificationNumber', 'sex', 'certificationNumber']);
  };
  // 邮箱验证
  validateEmail = (rule: any, value: any, callback: Function) => {
    return (value === undefined || value === '' || checkEmail.test(value)) ? callback() : callback('请填写正确的邮箱地址');
  };
  // 手机验证
  validatePhoneNumber = (rule: any, value: any, callback: Function) => {
    return (value === undefined || value === '' || checkPhoneNumber.test(value)) ? callback() : callback('请填写正确的手机号码');
  };

  // 处理表单提交
  // 只会有一个文件
  handleSubmit = (e: React.FormEvent): void => {
    const { emitData } = this.props;
    const { fileList } = this.state;
    // 阻止冒泡
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: ValidateCallback<any>, values: any) => {
      if (!err) {
        let isBirthdayValid = values.birthday as Moment;
        if(!isBirthdayValid.isValid()) {
          message.error('请确认身份证的出生日期是否正确!');
          return;
        }
        if(values.birthday === undefined) {
          message.error('请确认出生年月日是否已填');
        }
        // 检查是否进行了图片上传
        if(fileList.length !== 0) {
          if(fileList[0].hasOwnProperty('uid') && fileList[0].uid === -1) {
            emitData({ image:'' ,...values });
          } else {
            emitData({ image:fileList[0] ,...values });
            this.setState({ fileList:[] });
          }
        } else {
          emitData({ image:'' ,...values });
        }
      }
    });
  };

  /* =====================上传图片预览=========================== */

  // 将file 转码后的url设置 进入state
  handlePreview = async (file: any) => {
    if(!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    //
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  // 上传图片提交 保存在state的fileList中
  handleChange = (info: UploadChangeParam) => {
    const { file, fileList } = info;
    // 限制文件大小 为 2M
    if(file.size  / 1024 / 1024 > 2){
      message.error("文件大小超过2M，请重新上传");
      fileList.pop();
      return;
    }
    this.setState({ fileList })
  };

  render(): React.ReactNode {
    const { getFieldDecorator } = this.props.form;
    const { fileList, previewImage, previewVisible, isIDCard } = this.state;
    // 最大上传限制
    const maxUploadNumberLimitation = 1;
    // upload样式
    const uploadBtn: React.ReactNode = (
      <div className={styles['p-upload-block']} style={{width: '100px', height: '100px'}}>
        <div>
          <p><Icon type="plus-square" /></p>
          <p>点击上传运动员相片（选填）</p>
        </div>
      </div>
    );

    return (
      <div>
        <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({previewVisible: false})}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Form
          {...formStyle}
          onSubmit={this.handleSubmit}
        >
          <Item style={{textAlign: 'center'}}>
            <Upload
              fileList={fileList}
              listType="picture-card"
              beforeUpload={() => false}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >

              {(fileList.length > maxUploadNumberLimitation-1) ? null : uploadBtn}
            </Upload>
          </Item>
          <Item label='姓名'>
            {getFieldDecorator('name',{
              rules:[{required:true, message: '请输入真实姓名'}]
            })(
              <Input placeholder='请输入真实姓名' autoComplete='off' />
            )}
          </Item>
          <Item label='证件类型'>
            {getFieldDecorator('idCardType',{
              initialValue:'身份证',
              rules: [{required:true,message:'请选择你的证件号码类型'}],
            })(
              <Select placeholder='请选择证件类型' disabled={this.state.input_disabled} onChange={this.handlerCertificationTypeChange}>
                <Option value='身份证'>身份证</Option>
                <Option value='港澳通行证'>港澳台回乡证</Option>
              </Select>
            )}
          </Item>
          <Item label='证件号码'>
            {getFieldDecorator('identifyNumber',{
              rules:[{required:true, message: '请填写证件号码'},{validator: this.handleIDCardChange}],
            })(
              <Input disabled={this.state.input_disabled} placeholder='请填写证件号码' autoComplete='off'/>
            )}
          </Item>
          <Item label='性别'>
            {getFieldDecorator('sex',{
              rules: [{required:true,message:'请选择你的性别'}],
            })(
              <Select disabled={isIDCard}>
                <Option value='男'>男</Option>
                <Option value='女'>女</Option>
              </Select>
            )}
          </Item>
          <Item label='出生年月日' className={styles['require']} >
            {getFieldDecorator('birthday',{
            })(
              <DatePicker
                style={{width: '100%'}}
                disabled={isIDCard}
              />
            )}
          </Item>
          <Item label='联系电话'>
            {getFieldDecorator('phone',{
              rules: [{validator: this.validatePhoneNumber}]
            })(
              <Input placeholder="选填"/>
            )}
          </Item>
          <Item label='邮箱'>
            {getFieldDecorator('email',{
              rules: [{validator: this.validateEmail}]
            })(
              <Input placeholder="选填" />
            )}
          </Item>
          <Item label='地址'>
            {getFieldDecorator('residence',{})(
              <AddressInput/>
            )}
          </Item>
          <Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              提交信息
            </Button>
          </Item>
        </Form>
      </div>
    );
  }
}

const AIForm = Form.create<AthleteInfoFormProps>({
  mapPropsToFields:(props) => {
    const { currentAthleteData } = props;
    if(props.currentAthleteData){
      const { createFormField } = Form;
      const { athlete } = currentAthleteData;

      let residence = {
        city: athlete.province !== null ? athlete.province.split('-').slice(0,3) : [],
        address: athlete.address !== null ? athlete.address : ""
      };
      return {
        name: createFormField({value: athlete.name}),
        idCardType: createFormField({value: athlete.idcardtype}),
        identifyNumber: createFormField({value: athlete.idcard}),
        sex: createFormField({value: athlete.sex}),
        birthday: createFormField({value: moment(athlete.birthday)}),
        phone: createFormField({value: athlete.phonenumber === null ? "" : athlete.phonenumber }),
        email: createFormField({value: athlete.email  === null ? "" : athlete.email  }),
        residence: createFormField({value: residence}),
      }
    }else if(!props){
      return {};
    }


  }
})(AthleteInfoForm);

function ParticipantsAthleteList(props:{loading: boolean,matchId: number, unitId: number , athleteList: Array<any>, contestantId:number , dispatch: Dispatch}) {

  const { matchId, unitId, dispatch, athleteList, contestantId } = props;
  // modal
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalProps: ModalProps = {
    title: '添加/修改运动员',
    visible: visible,
    width: '80%',
    maskClosable: false,
    style: { top: 0 },
    footer: null,
    onCancel: () => {setVisible(false);setCurrentAthleteData({})}
  };

  const [currentAthleteData, setCurrentAthleteData] = useState({});
  const [isFirstCreate, setIsFirstCreate] = useState(true);
  // table
  // 类型暂时保留
  //
  const tableColumns:ColumnProps<athleteListProps>[] = [
    {
      title: '选择是否参赛', dataIndex: 'active', key: 'active',align:'center',
      render:(text:number, record: any) => {
        return (
          record.active === 1
            ? <Button onClick={(event) => handle_delete(record,event)} size="small" type="danger" >取消参赛</Button>
            : <Button style={{backgroundColor:'#52c41a'}} type="primary" onClick={(event) => handle_add(record,event)} size="small" >确认参赛</Button>
        );
      }
    },
    { title: '运动员姓名', key: 'name', align:'center', render:(text:any,record:any) => (<span>{record.athlete.name}</span>)},
    { title: '性别', key: 'sex', dataIndex: 'sex', align:'center', render:(text:any,record:any) => (<span>{record.athlete.sex}</span>) },
    { title: '证件号', key: 'identifyID', dataIndex: 'identifyID',align:'center', render:(text:any,record:any) => (<span>{record.athlete.idcard}</span>) },
    { title: '出生年月日', key: 'birthday', align:'center', render:(text:any,record:any) => ( <span>{record.athlete.birthday.slice(0,10)}</span>)},
    { title: '操作', key: 'handle',align:'center',
      render:(text:any, record:any) => (
        <div>
          {/* 使用外层 - 单位运动员id */}
          <a onClick={() => {editAthleteData(record)}}>修改</a>
          &nbsp;|&nbsp;
          {/* 删除使用内层id 运动员id */}
          <a style={{color:'#f5222d'}} onClick={() => {handlerDelete(record.athlete.id)}}>删除</a>
        </div>
      )
    }
  ];
  // 选中运动员是否参赛
  function handle_add(record: any, e: React.MouseEvent) {
    const { birthday, id } = record.athlete;
    // 选中
    let reqData = {
      matchdata: matchId,
      contestant: contestantId,
      unitathlete: record.id,
      birthday: birthday.slice(0,10),
      athlete: id
    };
    addParticipantsAthlete(reqData)
      .then(data => {
        // 无法通过 e 设置checked的值
        if(data) {
          dispatch({type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: {unitId, matchId}});
          message.success('确认成功');
        }
      })
  }
  function handle_delete(record: any, e: React.MouseEvent) {
    const { id } = record.athlete;
    // 先检查这个人是否有已经参加比赛的项目
    if(record.teamname.length !== 0) {
      message.warning('请先删除该运动员参加的团体项目');
      return;
    }
    // 先删除已报名的团队项目
    // props.dispatch({
    //   type: 'enroll/deleteTeamProject',
    //   payload: {
    //     matchdata : matchId,
    //     athlete : id,
    //     contestant : contestantId
    //   }
    // });
    deleteParticipantsAthlete({matchdata: matchId, athlete: id, contestant: contestantId})
      .then(data => {
        if(data) dispatch({type: 'enroll/checkIsEnrollAndGetAthleteLIST', payload: {unitId, matchId}});
      })
  }
  // 传入表单中
  function submitAthleteData(data: any) {
    let formData = new FormData();
    if(data.residence !== undefined && data.residence.hasOwnProperty('city') && data.residence.hasOwnProperty('address')){
      formData.append('province',data.residence.city !== undefined ? data.residence.city.join('-') : "" );
      formData.append('address',data.residence.address !== undefined ? data.residence.address : "" );
    }else{
      formData.append('province',"");
      formData.append('address',"");
    }
    formData.append('idcard',data.identifyNumber);
    formData.append('name',data.name);
    formData.append('idcardtype',data.idCardType);
    formData.append('sex',data.sex);
    formData.append('birthday',data.birthday.format('YYYY-MM-DD hh:mm:ss'));
    formData.append('phonenumber',data.phone !== undefined ? data.phone : "");
    formData.append('email',data.email !== undefined ? data.email : "" );
    formData.append('face',data.image.originFileObj !== undefined ? data.image.originFileObj : '');
    formData.append('unitdata', unitId.toString());
    if(isFirstCreate) {
      setLoading(true);
      newUnitAthlete(formData,{headers:{"Content-Type": "multipart/form-data"}}).then(data => {
        if(data) {
          // 没有重新渲染
          dispatch({ type: "enroll/checkIsEnrollAndGetAthleteLIST", payload: { unitId, matchId } });
          message.success('注册成功');
          setVisible(false);
          setCurrentAthleteData({});
        }
      });
    }else if(!isFirstCreate) {
      updatePlayer(formData)
        .then(res => {
          if(res !== "") {
            dispatch({
              type: "enroll/checkIsEnrollAndGetAthleteLIST",
              payload: { unitId, matchId }
            });
            message.success('修改成功！');
            setCurrentAthleteData({});
            setVisible(false);
          }
        })
    }

  }
  //
  function editAthleteData(record: object) {
    setCurrentAthleteData(record);
    setVisible(true);
    setIsFirstCreate(false);
  }
  function handlerDelete(id: number|string) {
    deleteAthlete({athlete:id, unitdata: unitId})
      .then(res => {
        if(res && res !== '') {
          dispatch({
            type: 'enroll/checkIsEnrollAndGetAthleteLIST',
            payload:{ matchId, unitId }
          });
          message.success('删除成功!');
        }
      });
  }

  function openDialog() {

    setVisible(true);
    setIsFirstCreate(true);
    setCurrentAthleteData({});
  }
  // 判断选中的运动员名单是否为空
  function judgeAthlete() {
    if(athleteList.length !== 0 && athleteList.filter((v:any) => (v.active === 1)).length !== 0) {
      if(matchId === 12 && athleteList.filter((v:any) => (v.active === 1)).length < 5) {
        message.warn('本场赛事运动员人数至少5人以上（含5人）,请确认勾选');
        return;
      }
      router.push('/enroll/individual')
    }else {
      message.warn('请添加运动员并勾选参赛运动员后后再进行报名');
    }
  }
  /*
  *  首次渲染的 unitId 为undefined
  *  会导致刷新页面不执行
  */
  useEffect(() => {
    if(matchId&&unitId) {
      dispatch({
        type: 'enroll/checkIsEnrollAndGetAthleteLIST',
        payload:{ matchId, unitId }
      })
    }
  },[unitId,matchId]);
  useEffect(() => {
    setLoading(false);
  },[visible]);

  return (
    <div className={styles['participants-athlete-list']}>
      <div className={styles['n-block']}>
        <Button type="primary" onClick={() => openDialog()}>添加运动员</Button>
      </div>
      <Modal {...modalProps}>
        <AIForm
          emitData={submitAthleteData}
          currentAthleteData={Object.keys(currentAthleteData).length === 0 ? false : currentAthleteData}
        />
        <Spin tip="上传中..." spinning={props.loading} size="large" style={{marginLeft:"47%"}}>
        </Spin>
      </Modal>
      <div>
        <Table
          columns={tableColumns}
          dataSource={athleteList}
          rowKey={record => record.id}
          scroll={{x:700}}
          loading={props.loading}
        />
      </div>
      <div>
        <Button
          type='primary'
          onClick={judgeAthlete}
        >
          确认运动员名单，进入个人报名通道
        </Button>
        <Button
          type='primary'
          style={{float:'right'}}
          onClick={() => router.goBack()}
        >
          返回
        </Button>
      </div>
    </div>
  );
}

export default connect(({enroll, loading}: ConnectState) => {
  return {
    athleteList: enroll.unit.athleteList,
    matchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    contestantId: enroll.unit.contestantUnitData.id,
    loading: loading.global
  };
})(ParticipantsAthleteList);
