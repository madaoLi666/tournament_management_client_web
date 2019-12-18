import React, { Component, useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Upload, message, Spin, Icon} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { FormComponentProps, FormProps, ValidateCallback } from 'antd/lib/form';
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { checkPhoneNumber, checkEmail } from '@/utils/regulars';
import { participativeUnit } from '@/services/enroll.ts';
// @ts-ignore
import styles from './index.less';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';

interface UnitInfoFormProps extends FormComponentProps {
  emitData: (data: object) => void;
  // 类型未定
  unitData: any;
  loading: boolean;
  dispatch: Dispatch;
}

const UnitInfoFormStyle: FormProps = {
  layout: 'horizontal',
  labelCol: { xs: { span: 24 }, sm: { span: 4 }, md: { span: 4 }, lg: { span: 4 }, xl: { span: 4 }, xxl: { span: 4 } },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 20 },
    xl: { span: 20 },
    xxl: { span: 20 },
  },
  colon: true,
  labelAlign: 'right',
};

class UnitInfoForm extends Component<UnitInfoFormProps, any> {

  constructor(props: UnitInfoFormProps) {
    super(props);
    this.state = {
      guaranteePic: false,
      url: '',
      loading: true
    };
  }

  componentDidUpdate(prevProps: Readonly<UnitInfoFormProps>, prevState: Readonly<any>, snapshot?: any): void {
    const { guaranteePic } = this.props.unitData;
    // guaranteePic存储的是服务器返回的url
    if(prevState.url !== guaranteePic){
      this.setState({url: guaranteePic});
    }
  }
  // 对 教练（选填项）电话号码判别
  checkOptionalPhone = (rule: any, value: any, callback: Function) => {
    if (value === '' || value === undefined) {
      callback();return;
    } else {
      if (checkPhoneNumber.test(value)) {
        callback();return;
      } else {
        callback('请输入正确的国内手机号码');return;
      }
    }
  };
  // 提交表单
  handleSubmit = (e: React.FormEvent): void => {
    const { guaranteePic, url } = this.state;
    // 阻止冒泡
    e.preventDefault();
    const { emitData, dispatch, loading } = this.props;
    this.props.form.validateFieldsAndScroll((err: ValidateCallback<any>, values: any) => {
      if (!err) {
        // 判断用户是否上传了承诺书图片
        if (guaranteePic || url !== '') {
          // 合并在此提交出 父组件 上一层
          let formRes = { guaranteePic: guaranteePic ? guaranteePic : "" , ...values };
          emitData(formRes);
        } else {
          message.error('请上传承诺书图片后再提交单位信息');
        }
      }
    });
  };

  // 上传调用函数
  handleUploadChange = (info: UploadChangeParam) => {
    const { file, fileList } = info;
    // 限制文件大小 为 2M
    if (file.size / 1024 / 1024 > 2) {
      message.error('文件大小超过2M，请重新上传');
      fileList.pop();
      return;
    }
    // 限制文件上传个数
    if (fileList.length > 1) {
      message.error('仅能上传一个文件');
      fileList.pop();
      return;
    }
    this.setState({ guaranteePic: file });
  };

  render(): React.ReactNode {
    const { getFieldDecorator } = this.props.form;
    const { guaranteePic, url } = this.state;
    const uploadProps: UploadProps = {
      accept: 'image/png,image/jpg',
      beforeUpload: () => false,
      listType: 'picture',
      onChange: this.handleUploadChange
    };

    return (
      <Form
        {...UnitInfoFormStyle}
        onSubmit={this.handleSubmit}
      >
        <Form.Item label='单位'>
          {getFieldDecorator('unitName', {})(<Input disabled={true}/>)}
        </Form.Item>
        <Form.Item label='参赛队伍'>
          {getFieldDecorator('unitNameAlias', {
            rules: [{ required: true, message: '请输入参赛别名，可与单位名称相同' }]
          })(<Input placeholder='请输入参赛队伍名字'/>)}
        </Form.Item>
        <Form.Item label='领队姓名'>
          {getFieldDecorator('leaderName', {
            rules: [{ required: true, message: '请输入领队姓名' }],
          })(
            <Input placeholder='请输入领队姓名'/>,
          )}
        </Form.Item>
        <Form.Item label='联系电话'>
          {getFieldDecorator('leaderPhone', {
            rules: [{ required: true, message: '请输入领队联系电话' }, { pattern: checkPhoneNumber, message: '请输入正确的国内手机号码' }],
          })(
            <Input placeholder='请输入领队联系电话'/>,
          )}
        </Form.Item>
        <Form.Item label='领队邮箱'>
          {getFieldDecorator('leaderEmail', {
            rules: [{ required: true, message: '请输入领队邮箱' }, { pattern: checkEmail, message: '请输入正确的电子邮箱地址' }],
          })(
            <Input placeholder='请输入邮箱'/>,
          )}
        </Form.Item>
        <Form.Item label='教练姓名'>
          {getFieldDecorator('coach1Name', {})(
            <Input placeholder='选填'/>,
          )}
        </Form.Item>
        <Form.Item label='联系电话'>
          {getFieldDecorator('coach1Phone', {
            rules: [{ validator: this.checkOptionalPhone }],
          })(
            <Input placeholder='选填'/>,
          )}
        </Form.Item>
        <Form.Item label='教练姓名'>
          {getFieldDecorator('coach2Name', {})(
            <Input placeholder='选填'/>,
          )}
        </Form.Item>
        <Form.Item label='联系电话'>
          {getFieldDecorator('coach2Phone', {
            rules: [{ validator: this.checkOptionalPhone }],
          })(
            <Input placeholder='选填'/>,
          )}
        </Form.Item>
        <Form.Item className={styles['require']} label='上传自愿责任书'>

          <Upload {...uploadProps} >
            {
              (guaranteePic===false && url!=="") ? (
                <div>
                  <img style={{width:"100%",height:"auto"}} src={url} alt=""/>
                </div>
              ) : (
                <div>
                  <Button>
                    <Icon type="cloud-upload" />&nbsp;Upload
                  </Button>
                </div>
              )
            }
          </Upload>
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 24 }}
          labelCol={{ span: 0 }}
        style={{ textAlign: 'center' }}
        >
        <br/>
        <span style={{color:'red'}} hidden={!this.props.loading}  >第一次上传需要几秒钟，请稍等&nbsp;&nbsp;<Spin spinning={!this.props.loading} /></span>
        <Button style={{ width: '100%' }} type='primary' htmlType='submit'>确认信息，进入报名</Button>
      </Form.Item>
      </Form>
    );
  }
}

const UIForm = connect(({loading}: ConnectState) => {
  return { loading: loading.global }
})(Form.create<UnitInfoFormProps>({
  mapPropsToFields: props => {
    const { createFormField } = Form;
    const { unitData } = props;
    // 判断unitData是否为false
    if (unitData.unitNameAlias !== ""){
      return {
        unitName: createFormField({value:unitData.unitName}),
        unitNameAlias: createFormField({value:unitData.unitNameAlias}),
        leaderName: createFormField({value:unitData.leaderName}),
        leaderPhone: createFormField({value:unitData.leaderPhone}),
        leaderEmail: createFormField({value:unitData.leaderEmail}),
        coach1Name: createFormField({value:unitData.coach1Name}),
        coach1Phone: createFormField({value:unitData.coach1Phone}),
        coach2Name: createFormField({value:unitData.coach2Name}),
        coach2Phone: createFormField({value:unitData.coach2Phone}),
      };
    }else { return {
      unitName: createFormField({value:unitData.unitName})
    } }
  },
})(UnitInfoForm));

function EditUnitInfo(props: { unitData: any, matchId: number, dispatch: Dispatch, currentTeamId: number }) {

  const { unitData, matchId, dispatch, currentTeamId } = props;

  function submitData(data: any) {
    if(unitData){
      // 数据装载
      let formData = new FormData();
      formData.append('unitdata', unitData.unitId);
      formData.append('matchdata', matchId.toString());
      formData.append('contestant_id' , currentTeamId.toString());
      formData.append('name', data.unitNameAlias === undefined ? "" : data.unitNameAlias );
      formData.append('leader', data.leaderName);
      formData.append('leaderphonenumber', data.leaderPhone);
      formData.append('email', data.leaderEmail);
      formData.append('coachone', data.coach1Name === undefined ? "" : data.coach1Name);
      formData.append('coachonephonenumber', data.coach1Phone === undefined ? "" : data.coach1Phone);
      formData.append('coachtwo', data.coach2Name === undefined ? "" : data.coach2Name);
      formData.append('coachtwophonenumber', data.coach2Phone === undefined ? "" : data.coach2Phone);
      formData.append('dutybook', data.guaranteePic);
      participativeUnit(formData,{headers: {"Content-Type": "multipart/form-data"}})
        .then(async (data) => {
          // 判断请求状况
          if(data) {
            let uD = {
              id: data.id,
              leaderName: data.leader,
              leaderPhone: data.leaderphonenumber,
              leaderEmail: data.email,
              coach1Name: data.coachone,
              coach1Phone: data.coachonephonenumber,
              coach2Name: data.coachtwo,
              coach2Phone: data.coachtwophonenumber,
              guaranteePic: data.dutybook
            };
            // 修改unitData
            window.localStorage.setItem('currentTeamId', String(uD.id));
            dispatch({ type: 'enroll/modifyUnitData', payload: { unitData: uD} });
            router.push('/enroll/participants');
          }
        })
    }
  }

  useEffect(() => {
    if (currentTeamId !== undefined && currentTeamId !== null) {
      dispatch({
        type: 'enroll/getContestantUnitData',
        payload: { matchId: matchId, unitId: unitData.unitId }
      })
    }else {
      message.warning('请选择参赛队伍');
      router.push('/enroll/choiceTeam');
    }

  },[matchId, unitData.unitId]);

  return (
    <div className={styles['edit-unit-info']}>
      <UIForm
        emitData={submitData}
        unitData={unitData}
      />
      <Button className={styles.editButton} onClick={() => {router.push('/enroll/choiceTeam')}} >返回队伍选择</Button>
    </div>
  );
}

export default connect(({ enroll,user }: ConnectState) => {
  const currentTeamId = window.localStorage.getItem('currentTeamId');
  const { unit, unitInfo } = enroll;
  const { unitData } = unit;
  // 单位名称
  const { unitName } = unitInfo;
  let tempUnitData = {
    unitName,
    unitId: unitInfo.id,
    // 这个unitNameAlias是队伍名称，因为之前不是安装队伍来报名的，所以名字有错
    unitNameAlias: '', leaderName: '', leaderPhone: '', leaderEmail: '',
    coach1Name: '', coach1Phone: '', coach2Name: '', coach2Phone: '',
    guaranteePic: ''
  };
  for (let i = 0; i < unitData.length; i++) {
    if (unitData[i].id === Number(currentTeamId)) {
      tempUnitData.unitNameAlias = unitData[i].name;
      tempUnitData.leaderName = unitData[i].leader;
      tempUnitData.leaderPhone = unitData[i].leaderphonenumber;
      tempUnitData.leaderEmail = unitData[i].email;
      tempUnitData.coach1Name = unitData[i].coachone;
      tempUnitData.coach1Phone = unitData[i].coachonephonenumber;
      tempUnitData.coach2Name = unitData[i].coachtwo;
      tempUnitData.coach2Phone = unitData[i].coachtwophonenumber;
      tempUnitData.guaranteePic = unitData[i].url_dutybook;
      break;
    }
  }
  if (currentTeamId !== undefined && currentTeamId !== null) {
    return {
      unitData: tempUnitData,
      matchId: enroll.currentMatchId,
      currentTeamId: Number(currentTeamId)
    };
  }else {
    return {
      unitData: tempUnitData,
      matchId: enroll.currentMatchId,
      currentTeamId: undefined
    };
  }
})(EditUnitInfo);
