import { getHomePic } from '@/services/gameListService';
import { List, PageHeader, Typography } from 'antd';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import styles from './train.less';
import { router } from 'umi';

const data_0913 = [
  {
    title: '培训班交通指引',
    id: 0,
  },
  {
    title: '粤轮协【2020】11号 关于举办2020年广东省滑板等级教练员培训班的通知',
    id: 1,
  },
  {
    title: '附件1：滑板教练员技术等级申请表',
    id: 2,
  },
];

function Train() {
  const [files_0913, setFiles_0913] = useState([]);

  useEffect(() => {
    getHomePic().then(data => {
      if (data) {
        setFiles_0913(data.filter((m: any) => m.id >= 67 && m.id <= 69).map((v: any) => v.file));
      } else {
        console.error('文件获取失败');
      }
    });
  }, []);

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
            <strong>关于举办 2020 年广东省滑板初级教练员培训班的通知</strong>
          </div>
        }
        bordered
        dataSource={data_0913}
        renderItem={item => (
          <List.Item>
            <Typography.Text strong>
              <a href={files_0913[item.id]}>[点击下载]</a>
            </Typography.Text>{' '}
            {item.title}
          </List.Item>
        )}
      />
    </div>
  );
}

export default connect()(Train);
