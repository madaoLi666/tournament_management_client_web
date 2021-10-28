import React, { useEffect, useState } from 'react';
import { amateurlevelRawScoreSearch } from '@/services/amateurlevel';
import AmateurlevelSearchForm from './Form';
import AmateurLevelSearchTable from './Table';
import styles from './index.less';

function AmateurLevelSearch(){

  const [data, setData] = useState([])

  const search = (reqData: any) => {
    for(let key in reqData){
      reqData[key] = btoa(reqData[key])
    }
    amateurlevelRawScoreSearch(reqData).then((res: any) => {
      setData(res)
    })
  }

  return (
    <div className={styles['amateur-level-search']}>
      <p>广东省轮滑技术水平等级测试 - 评定查询平台</p>
      <AmateurlevelSearchForm submit={search}/>
      <AmateurLevelSearchTable data={data}/>
    </div>
  )
}

export default AmateurLevelSearch