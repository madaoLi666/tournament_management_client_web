import React, { useState, useEffect } from 'react';
import { PageHeader } from 'antd';
import { connect } from 'dva';

import AmateurlevelSearch from '@/pages/AmateurLevel/AmateurLevelSearch';
import ExaminationList from './ExaminationList';
import { getAmateurExaminationList } from '@/services/amateurlevel';
import { router } from 'umi';
import styles from './index.less';

function AmateurLevelIndex(props: any) {
  
  const { downloadFileList, dispatch } = props;
  const [amateurExaminationList, setamateurExaminationList] = useState([]);

  useEffect(() => {
    if(downloadFileList) {
      return;
    }
    dispatch({ type: "download/getDownloadFileList" });
    getAmateurExaminationList().then((res: any) => {
      if(res && res.length) {
        setamateurExaminationList(res);
      }
    })
  }, []);

  return (
    <div className={styles['download']}>
      <header className={styles['header']}>
        <PageHeader
          className="site-page-header"
          onBack={() => router.push(`/home`)}
          title="返回主页"
        />
      </header>
      <AmateurlevelSearch/>
      <ExaminationList data={amateurExaminationList}/>
    </div>
  );
}

export default connect((model: any) => {
  return{
    
  }
})(AmateurLevelIndex);
