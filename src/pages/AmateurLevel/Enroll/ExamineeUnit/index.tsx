import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Dispatch, connect } from 'dva';
import { Button, Card, Input, Checkbox, message, Modal } from 'antd';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';

import { getExamineeUnit, createExamineeUnit, patchExamineeUnit } from '@/services/amateurlevel';

import { PlusCircleOutlined } from '@ant-design/icons/lib';
import _ from 'lodash';

interface ExamineeUnitProps {
  dispatch: Dispatch;
  loading: boolean;
  unitId: number;
  unitName: string | null | undefined;
  amateurExaminationData: any;
}

function ExamineeUnit(props: ExamineeUnitProps) {
  const { amateurExaminationData, loading, unitName, unitId, dispatch, } = props;
  const [examieeUnitList, setExamieeUnitList] = useState<Array<any> | null>(null);
  const [isShowForm, setIsShowForm] = useState(false);
  const [examineeUnitData, setexamineeUnitData] = useState<{ name?: string, id?: number }>({});
  const [selectedId, setSelectedId] = useState(null);

  const getExamineeUnitList = () => {
    getExamineeUnit({ "examination_id": amateurExaminationData.id, "unit_id": unitId }).then((res: any) => {
      if (res) {
        setExamieeUnitList(res)
      }
    })
  }

  const handleModalOk = () => {
    if (examineeUnitData.id) {
      patchExamineeUnit({ "id": examineeUnitData.id, "name": examineeUnitData.name }).then((res: any) => {
        if (res) {
          setexamineeUnitData({});
          setIsShowForm(false);
          message.info("报考点名称修改成功");
          getExamineeUnitList()
        }
      })
    } else {
      createExamineeUnit({ "examination_id": amateurExaminationData.id, "unit_id": unitId, "name": examineeUnitData.name }).then((res: any) => {
        if (res) {
          setexamineeUnitData({});
          setIsShowForm(false);
          message.info("报考点创建成功");
          getExamineeUnitList()
        }
      })
    }
  }

  const handleModalCancel = () => {
    setIsShowForm(false);
    setexamineeUnitData({});
  }

  const handleInput = (e: any) => {
    setexamineeUnitData({
      ...examineeUnitData,
      name: e.target.value
    });
  }

  const handleEdit = (examieeUnit: any) => {
    setIsShowForm(true);
    setexamineeUnitData({
      name: examieeUnit?.name,
      id: examieeUnit?.id
    })
  }

  useEffect(() => {
    getExamineeUnitList()
  }, [amateurExaminationData, unitId])

  const enterAmateurexamineeEnrollPage = () => {
    router.push('/amateurlevel/examieeenroll');
    dispatch({
      type: 'amateur/setExamieeUnit',
      payload: { data: examieeUnitList?.find((examieeUnitData) => examieeUnitData.id === selectedId)}
    })
  }

  return (
    <div className={styles.listCard}>
      <Card className={styles.content} bordered={false} title={<strong>单位：{unitName}</strong>}>
        <Button
          loading={loading}
          type="dashed"
          onClick={() => setIsShowForm(true)}
          className={styles.btn}
          icon={<PlusCircleOutlined />}
        >
          新建报名点(俱乐部)
        </Button>
        <div className={styles.list}>
          {
            examieeUnitList && examieeUnitList.map((examieeUnitItem) => (
              <div key={examieeUnitItem.id}>
                <div>
                  <Checkbox
                    checked={examieeUnitItem.id === selectedId}
                    onChange={() => setSelectedId(examieeUnitItem.id)}
                  />
                </div>
                <div>
                  <span>{examieeUnitItem.name}</span>
                </div>
                <div>
                  <span onClick={() => handleEdit(examieeUnitItem)}>
                    <a>
                      修改名称
                    </a>
                  </span>
                </div>
              </div>
            ))
          }
        </div>
      </Card>
      <div className={styles.editButton}>
        {examieeUnitList && examieeUnitList.length != 0 && !selectedId && (
          <span>请勾选其中一个报名点(俱乐部)进入下一步</span>
        )}
        &nbsp;&nbsp;
        <Button 
          type={`primary`}
          disabled={!selectedId}
          onClick={enterAmateurexamineeEnrollPage}
        >确认</Button>
        &nbsp;&nbsp;
        <Button
          onClick={() => router.push("/home/amateurlevel")}
        >退出</Button>
      </div>
      <Modal
        title={`输入报名点名称`}
        visible={isShowForm}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        mask={true}
        maskClosable={false}
      >
        <Input
          value={examineeUnitData?.name}
          onChange={handleInput}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = ({ loading, enroll, unit, amateur }: ConnectState) => {

  return {
    loading: loading.global,
    currentMatchId: enroll.currentMatchId,
    unitId: enroll.unitInfo.id,
    unitName: unit.mainpart,
    amateurExaminationData: amateur.amateurExaminationData
  };
};

export default connect(mapStateToProps)(ExamineeUnit);
