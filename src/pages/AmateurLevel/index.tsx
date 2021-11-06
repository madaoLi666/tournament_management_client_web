import React, { useState, useEffect } from 'react';
import { List, PageHeader, Typography } from 'antd';
import { connect } from 'dva';

import AmateurlevelSearch from '@/pages/AmateurLevel/AmateurLevelSearch';

import { router } from 'umi';
import styles from './index.less';

const data_1008 = [
  {
    title: '粤轮协【2020】16号 关于举办《广东省轮滑技术水平等级测试（20201024期）》的通知',
    id: 0,
  },
  {
    title: '附件2 广东省轮滑技术水平等级测试内容和标准',
    id: 1,
  },
  {
    title: '附件3：广东省轮滑技术水平等级测试（20201024期）报名表',
    id: 2,
  },
  {
    title: '附件4：越级申请表（20201024期）',
    id: 3,
  },
];

function AmateurLevelIndex(props: any) {
  const { downloadFileList, dispatch } = props;

  const [files_1008, setFiles_1008] = useState([]);

  useEffect(() => {
    if(downloadFileList) {
      return;
    }
    dispatch({ type: "download/getDownloadFileList" })
  }, []);

  useEffect(() => {
    if (downloadFileList) {
      setFiles_1008(downloadFileList.filter((m: any) => m.id >= 70 && m.id <= 73).map((v: any) => v.file));
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
      <AmateurlevelSearch/>
      <List
        header={
          <div style={{ textAlign: 'center' }}>
            <strong>关于举办《广东省轮滑技术水平等级测试（20201024期）》的通知</strong>
          </div>
        }
        bordered
        dataSource={data_1008}
        renderItem={item => (
          <List.Item>
            <Typography.Text strong>
              <a href={files_1008[item.id]}>[点击下载]</a>
            </Typography.Text>{' '}
            {item.title}
          </List.Item>
        )}
      />
    </div>
  );
}

export default connect((model: any) => {
  return{
    downloadFileList: model?.download?.downloadFileList
  }
})(AmateurLevelIndex);
