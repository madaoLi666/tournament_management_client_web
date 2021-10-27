import React, { useEffect, useState } from 'react';
import { amateurlevelRawScoreSearch } from '@/services/amateurlevel';
import AmateurlevelSearchForm from './Form';
import AmateurLevelSearchTable from './Table';
import styles from './index.less';

function AmateurLevelSearch(){

  const [data, setData] = useState([])

  const search = (reqData: any) => {
    amateurlevelRawScoreSearch(reqData).then((res: any) => {
      setData(res)
    })
  }

  return (
    <div className={styles['amateur-level-search']}>
      <AmateurlevelSearchForm submit={search}/>
      <AmateurLevelSearchTable data={data}/>
    </div>
  )
}

export default AmateurLevelSearch