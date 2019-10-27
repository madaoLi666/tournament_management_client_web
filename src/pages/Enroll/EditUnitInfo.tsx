import React, { Component, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Spin} from 'antd';
import { FaCloudUploadAlt } from 'react-icons/fa';
import router from 'umi/router';
import { connect } from 'dva';
import { FormComponentProps, FormProps, ValidateCallback } from 'antd/lib/form';
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { checkPhoneNumber, checkEmail } from '@/utils/regulars';
import { participativeUnit } from '@/services/enroll.ts';
// @ts-ignore
import styles from './index.less';
import { Dispatch } from 'redux';

// interface UnitInfo {
//   // 单位id
//   unitdata: number;
//   // 赛事id
//   matchdata: number;
//   // 本场赛事单位id
//   name: number;
//   leader: string;
//   leaderphonenumber: string;
//   coachone?: string;
//   coachonephonenumber?: string;
//   coachtwo?: string;
//   coachotwophonenumber?: string;
//   dutybook: File
// }

interface UnitInfoFormProps extends FormComponentProps {
  emitData: (data: object) => void;
  // 类型未定
  unitData: any;
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

  state = {
    guaranteePic: false,
    url: '',
    loadingHide: true,
  };

  //
  componentDidUpdate(prevProps: Readonly<UnitInfoFormProps>, prevState: Readonly<any>, snapshot?: any): void {
    const { guaranteePic } = this.props.unitData;
    // guaranteepic存储的是服务器返回的url
    if(prevState.url !== guaranteePic){
      this.setState({url: guaranteePic});
    }
  }
  // 对 教练（选填项）电话号码判别
  checkOptionalPhone = (rule: any, value: any, callback: Function) => {
    if (value === '' || value === undefined) {
      callback();
    } else {
      if (checkPhoneNumber.test(value)) {
        callback();
      } else {
        callback('请输入正确的国内手机号码');
      }
    }
  };
  // 提交表单
  handleSubmit = (e: React.FormEvent): void => {
    const { guaranteePic, url } = this.state;
    // 阻止冒泡
    e.preventDefault();
    const { emitData } = this.props;
    this.props.form.validateFieldsAndScroll((err: ValidateCallback<any>, values: any) => {
      if (!err) {
        // 判断用户是否上传了承诺书图片
        if (guaranteePic || url !== '') {
          // 合并在此提交出 父组件 上一层
          let formRes = { guaranteePic: guaranteePic ? guaranteePic : "" , ...values };
          this.setState({loadingHide: true});
          emitData(formRes);
          this.setState({loadingHide: false});
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
      beforeUpload: () => (false),
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
        <Form.Item label='参赛单位别名'>
          {getFieldDecorator('unitNameAlias', {
            rules: [{ required: true, message: '请输入参赛别名，可与单位名称相同' }]
          })(<Input placeholder='可以使用别名参赛'/>)}
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
                    <FaCloudUploadAlt/>&nbsp;Upload
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
          <span style={{color:'red'}} hidden={this.state.loadingHide} >第一次上传需要几秒钟，请稍等&nbsp;&nbsp;<Spin /></span>
          <Button style={{ width: '100%' }} type='primary' htmlType='submit'>确认信息，进入报名</Button>
        </Form.Item>
      </Form>
    );
  }
}

const UIForm = Form.create<UnitInfoFormProps>({
  mapPropsToFields: props => {
    const { createFormField } = Form;
    const { unitData } = props;
    // 判断unitData是否为false
    if (unitData.unitNameAlias !== ""){
      return {
        unitName: createFormField({value:unitData.unitName}),
        unitNameAlias: createFormField({value:unitData.unitName}),
        leaderName: createFormField({value:unitData.leaderName}),
        leaderPhone: createFormField({value:unitData.leaderPhone}),
        leaderEmail: createFormField({value:unitData.leaderEmail}),
        coach1Name: createFormField({value:unitData.coach1Name}),
        coach1Phone: createFormField({value:unitData.coach1Phone}),
        coach2Name: createFormField({value:unitData.coach2Name}),
        coach2Phone: createFormField({value:unitData.coach2Phone}),
      };
    }else { return {
      unitName: createFormField({value:unitData.unitName}),
      unitNameAlias: createFormField({value:unitData.unitName}),
    } }
  },
})(UnitInfoForm);

function EditUnitInfo(props: { unitData: any, matchId: number, dispatch: Dispatch }) {

  const { unitData, matchId,dispatch } = props;

  function submitData(data: any) {
    if(unitData){
      // 数据装载
      let formData = new FormData();
      formData.append('unitdata', unitData.unitId);
      formData.append('matchdata', matchId.toString());
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
            dispatch({ type: 'enroll/modifyUnitData', payload: { unitData: uD} });
            router.push('/enroll/participants');
          }
        })
    }
  }

  useEffect(() => {
    if(unitData.unitId !== "" && unitData.unitId !== undefined) {
      dispatch({
        type: 'enroll/getContestantUnitData',
        payload:{ matchId: matchId, unitId:unitData.unitId }
      })
    }

  },[unitData.unitId]);

  return (
    <div className={styles['edit-unit-info']}>
      <UIForm
        emitData={submitData}
        unitData={unitData}
      />
    </div>
  );
}

export default connect(({ enroll,user }: any) => {
  const { unitInfo,currentMatchId } = enroll;
  const { unitData } = enroll.unit;
  const { athleteData } = user;
  let targetUnitData = {
    unitId: unitInfo.id,
    unitName: unitInfo.unitName,
    unitNameAlias: '',
    leaderName: '', leaderPhone: '',
    coach1Name: '', coach1Phone: '',
    coach2Name: '', coach2Phone: '',
    leaderEmail:'',
    guaranteePic: '',
  };
  // 有账号信息
  if(athleteData !== undefined && athleteData !== null && athleteData.length !== 0 && user.email !== null && user.email !== undefined && user.email !=='') {
    targetUnitData.leaderName = athleteData[0].name;
    targetUnitData.leaderPhone = user.phonenumber;
    targetUnitData.leaderEmail = user.email;
  }
  // 有报名信息
  if(Object.keys(unitData).length !== 0){
    targetUnitData = { unitId: unitInfo.id, unitName: unitInfo.unitName, ...unitData };
  }else {
    targetUnitData.unitNameAlias = unitInfo.unitName;
  }

  return { unitData: targetUnitData, matchId:currentMatchId };
})(EditUnitInfo);

