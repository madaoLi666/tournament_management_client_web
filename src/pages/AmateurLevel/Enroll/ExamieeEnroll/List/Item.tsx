import React,{ useEffect, useState } from 'react';

import { Select, Button, message } from 'antd';

import { examinationEnroll } from '@/services/amateurlevel';

import styles from './Item.less';

interface EnrollItemProps {
  examinee: any,
  optionMapping: Array<{label: string, value: number}>,
  amateurExaminationDataItem: any
}

const EnrollItem = (props: EnrollItemProps) => {
  const { examinee, optionMapping, amateurExaminationDataItem } = props;

  const [selectedItemId, setSelectedItemId] = useState(examinee?.item_id);

  const examinationEnrollFunc = () => {
    examinationEnroll({
      "examinee_id": examinee.id,
      "item_id": selectedItemId
    }).then((res: any) => {
      if(res) {
        message.success("报名成功");
        setSelectedItemId(selectedItemId);
      }
    })
  }

  useEffect(() => {
    // 拿这个人的业余等级去比较
    
  }, [])

  return (
    <div className={styles["amateurlevel-enroll-item"]}>
      <div className={styles["name"]}>
        <span>{examinee.name}</span>
      </div>
      <div className={styles["sex"]}>
        <span>{examinee.sex}</span>
      </div>
      <div className={styles["idcared"]}>
        <span>{examinee.idcard}</span>
      </div>
      <div className={styles["select"]}>
        <Select
          options={optionMapping}
          defaultValue={examinee['item_id']}
          onChange={(value) => setSelectedItemId(value)}
          style={{width: "200px"}}
        />
      </div>
      <div className={styles["btn"]}>
        <Button
          type={`primary`}
          disabled={selectedItemId === examinee?.item_id}
          onClick={examinationEnrollFunc}
        >
          提交
        </Button>
      </div>
    </div>
  )
}

export default EnrollItem;

