import React, { useState } from "react";
import { Button, Input } from 'antd';

import styles from './index.less';

interface AmateurlevelSearchFormProps {
  submit: (data: object) => void
}

const AmateurlevelSearchForm = (props: AmateurlevelSearchFormProps): JSX.Element => {
  
  const [idcard, setIdCard] = useState<string>('')
  const [serialNumber, setSerialNumber] = useState<string>('')

  const handleIdCardChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIdCard(event.target.value)
  }

  const handleSerialNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSerialNumber(event.target.value)
  }

  const handleSearch = () => {
    const { submit } = props;
    if(idcard){
      submit({
        "idcard": idcard
      })
    }
    if(serialNumber){
      submit({
        "serial_number": serialNumber
      })
    }
  }

  return (
    <div className={styles['amateur-level-form']}>
      <div>
        <Input 
          placeholder="请输入证件号码"
          value={idcard}
          onChange={handleIdCardChange}
          disabled={!!serialNumber}
        />
      </div>
      <div>
        <Input 
          placeholder="请输入考评编号"
          value={serialNumber}
          onChange={handleSerialNumberChange}
          disabled={!!idcard}
        />
      </div>
      <div>
        <Button
          disabled={!idcard && !serialNumber}
          onClick={handleSearch}
        >
          搜索
        </Button>
      </div>
    </div>
  );
};

export default AmateurlevelSearchForm;
