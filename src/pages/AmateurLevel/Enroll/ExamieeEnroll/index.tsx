import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import { Button, Modal, message } from 'antd';
import EnrollHeader from '@/pages/Enroll/components/enrollHeader';
import { AthleteFormValues } from '@/components/athleteForm/modalForm';
import AthleteForm from './Form';
import EnrollList from './List'
import { createExaminee, getExamineeList, getAmateurExaminationItem } from '@/services/amateurlevel';
import { router } from 'umi';
interface ExamineeEnrollProps {
  dispatch: Dispatch,
  unitId: number,
  amateurExamineeUnit: any,
  amateurExaminationData: any
}

function ExamineeEnroll(props: ExamineeEnrollProps) {
  const { unitId, dispatch, amateurExamineeUnit, amateurExaminationData } = props;

  // 今次开设的项目
  const [amateurExaminationDataItem, setAmateurExaminationDataItem] = useState<Array<any>|null>(null);
  const [examineeList, setExamineeList] = useState<Array<any>|null>(null);

  const getExamineeListFunc = () => {
    getExamineeList({
      "examinee_unit_id": amateurExamineeUnit.id,
    }).then((res: any) => {
      if(res){
        setExamineeList(res)
      }
    })
  }

  useEffect(() => {
    getExamineeListFunc();
    getAmateurExaminationItem({ "examination_id": amateurExaminationData.id }).then((res: any) => {
      if (res) {
        setAmateurExaminationDataItem(res)
      }
    })
  }, [amateurExaminationData]);


  /***************** modal **********************/
  const [isShowModal, setIsShowModal] = useState(false);
  const [confirmLoading, setLoading] = useState(false);
  const formRef = React.createRef();

  // 提交表单的事件
  const handleModalOk = () => {
    // @ts-ignore
    formRef.current
      .validateFields()
      .then((values: any) => {
        // @ts-ignore
        // formRef.current.resetFields();
        emitData(values);
      })
      .catch((info: any) => {
        console.log(info);
        if (info.errorFields) {
          message.error(info.errorFields[0].errors[0]);
        }
      });
  };

  const emitData = (value: AthleteFormValues) => {
    let data;
    if (value.uploadPic) {
      data = { image: value.uploadPic[0], ...value }
    } else {
      data = { image: '', ...value }
    }
    let formData = new FormData();
    if (
      data.residence !== undefined &&
      data.residence.hasOwnProperty('city') &&
      data.residence.hasOwnProperty('address')
    ) {
      formData.append(
        'province',
        data.residence.city !== undefined ? data.residence.city.join('-') : '',
      );
      formData.append(
        'address',
        data.residence.address !== undefined ? data.residence.address : '',
      );
    } else {
      formData.append('province', '');
      formData.append('address', '');
    }
    formData.append('idcard', data.identifyNumber);
    formData.append('name', data.name);
    formData.append('idcardtype', data.idCardType);
    formData.append('sex', data.sex);
    formData.append('birthday', data.birthday.format('YYYY-MM-DD hh:mm:ss'));
    formData.append('phonenumber', data.phone !== undefined ? data.phone : '');
    formData.append('email', data.email !== undefined ? data.email : '');
    formData.append('face', data.image.originFileObj !== undefined ? data.image.originFileObj : '');
    formData.append('unitdata', unitId.toString());
    formData.append('examinee_unit_id', amateurExamineeUnit.id.toString());

    // 添加考生
    createExaminee(formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
      if(res){
        handleModalCancel();
        getExamineeListFunc();
      }
    })
  };

  const handleModalCancel = () => {
    // @ts-ignore
    formRef.current.resetFields();
    setIsShowModal(false);
  }

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <EnrollHeader
          title={'考试报名'}
          buttonDom={
            <Button type="primary" onClick={() => setIsShowModal(true)}>
              添加考生
            </Button>
          }
        />
        <div>
          <EnrollList
            examineeList={examineeList}
            amateurExaminationDataItem={amateurExaminationDataItem}
          />
        </div>
        <Modal
          title={`新增运动员`}
          visible={isShowModal}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          mask={true}
          maskClosable={false}
        >
          <AthleteForm
            isAdd={true}
            initialValue={null}
            formRef={formRef}
            haveContact={false}
          />
        </Modal>
      </div>

      <div className={styles.hr} />
      <div className={styles.btn}>
        <Button onClick={() => router.push('/amateurlevel/examieeunit')}>返回</Button>
      </div>
    </div>
  );

}

const mapStateToProps = ({ unit, amateur }: ConnectState) => {
  return {
    unitId: unit["unitdata_id"],
    amateurExamineeUnit: amateur.examieeUnit,
    amateurExaminationData: amateur.amateurExaminationData
  };
};

export default connect(mapStateToProps)(ExamineeEnroll);
