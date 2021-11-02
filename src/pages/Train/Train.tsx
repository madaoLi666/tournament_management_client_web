import React, { useState, useEffect, useMemo } from 'react';
import { List, PageHeader, Typography } from 'antd';
import { connect } from 'dva';

import { router } from 'umi';
import styles from './train.less';

function Train(props: any) {
  const { downloadFileList, dispatch } = props;

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if(downloadFileList) {
      return;
    }
    dispatch({ type: "download/getDownloadFileList" })
  }, []);

  useEffect(() => {
    if (downloadFileList) {
      setFileList(downloadFileList.filter((m: any) => m.id >= 74 && m.id <= 76));
    }
  }, [downloadFileList])

  return (
    <div className={styles['download']}>
      <header className={styles['header']}>
        <PageHeader
          className="site-page-header"
          onBack={() => {
            router.goBack();
          }}
          title="返回主页"
        />
      </header>
      <List
        header={
          <div style={{ textAlign: 'center' }}>
            <strong>关于举办2021年广东省速度轮滑裁判员培训班通知</strong>
          </div>
        }
        bordered
        dataSource={fileList}
        renderItem={(item: {name: string, file: string}) => (
          <List.Item>
            <Typography.Text strong>
              <a href={item?.file}>[点击下载]</a>
            </Typography.Text>{' '}
            {item?.name}
          </List.Item>
        )}
      />
      <br />
    </div>
  );
}

export default connect((model: any) => {
  return{
    downloadFileList: model?.download?.downloadFileList
  }
})(Train);
