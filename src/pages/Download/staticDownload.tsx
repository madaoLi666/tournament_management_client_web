import React, { useEffect } from 'react';
import { List, PageHeader, Typography } from 'antd';
import { connect } from 'dva';

import { getHomePic } from '@/services/gameListService';
import styles from './index.less';

const p = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/img/p.png';

const data = [
  {
    title: '粤轮协【2019】24号 关于举办《广东省轮滑技术水平等级测试（20191027期）》的通知',
    id: 0,
  },
  {
    title: '附件2 广东省轮滑技术水平等级测试(20191027期）内容和标准',
    id: 1,
  },
  {
    title: '附件3：广东省轮滑技术水平等级测试（20191027期）报名表',
    id: 2,
  },
  {
    title: '附件4：越级申请表（20191027期）',
    id: 3,
  },
];

const data1 = [
  {
    title: '粤轮协【2019】25号 关于举办《广东省轮滑技术水平等级测试（20191102期）》的通知',
    id: 0,
  },
  {
    title: '附件2 广东省轮滑技术水平等级测试内容和标准（20191102期）',
    id: 1,
  },
  {
    title: '附件3：广东省轮滑技术水平等级测试（20191102期）报名表',
    id: 2,
  },
  {
    title: '附件4：越级申请表（20191102期）',
    id: 3,
  },
];

const data_0705 = [
  {
    title: '关于举办《广东省轮滑技术水平等级测试（20200705期）》的通知',
    id: 0,
  },
  {
    title: '附件2、广东省轮滑技术水平等级测试（20200705期）内容和标准',
    id: 1,
  },
  {
    title: '附件3：广东省轮滑技术水平等级测试（20200705期）报名表',
    id: 2,
  },
  {
    title: '附件4：越级申请表（20200705期）',
    id: 3,
  },
];

function StaticDownload(props: any) {
  
  const { downloadFileList, dispatch } = props;

  const logo: React.ReactNode = (
    <div className={styles.logo}>
      <div style={{ width: '100%' }}>
        <img
          src="https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/img/logo2.png"
          alt=""
        />
        <span>
          <b style={{ marginLeft: 5 }}>轮滑赛事辅助系统</b>
        </span>
      </div>
    </div>
  );

  // 获取文件
  const [files, setFiles] = React.useState([]);
  const [files_1102, setFiles_1102] = React.useState([]);
  const [files_0705, setFiles_0705] = React.useState([]);

  useEffect(() => {
    if(downloadFileList) {
      return;
    }
    dispatch({ type: "download/getDownloadFileList" })
  }, []);

  useEffect(() => {
    if (downloadFileList) {
      setFiles(downloadFileList.filter((m: any) => m.id >= 16 && m.id <= 19).map((v: any) => v.file));
      setFiles_1102(downloadFileList.filter((m: any) => m.id >= 20 && m.id <= 23).map((v: any) => v.file));
      setFiles_0705(downloadFileList.filter((m: any) => m.id >= 63 && m.id <= 66).map((v: any) => v.file));
    }
  }, [downloadFileList]);

  return (
    <div className={styles['download']}>
      <header className={styles['header']}>
        <PageHeader title={logo} />
      </header>
      <List
        header={
          <div style={{ textAlign: 'center' }}>
            <strong>江门：广东省轮滑技术水平等级测试（20200705期）</strong>
          </div>
        }
        bordered
        dataSource={data_0705}
        renderItem={item => (
          <List.Item>
            <Typography.Text strong>
              <a href={files_0705[item.id]}>[点击下载]</a>
            </Typography.Text>{' '}
            {item.title}
          </List.Item>
        )}
      />
      <br />
      <br />
      <List
        header={
          <div style={{ textAlign: 'center' }}>
            <strong>韶关：广东省轮滑技术水平等级测试（20191027期）</strong>
          </div>
        }
        bordered
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Typography.Text strong>
              <a href={files[item.id]}>[点击下载]</a>
            </Typography.Text>{' '}
            {item.title}
          </List.Item>
        )}
      />
      <br />
      <br />
      <List
        header={
          <div style={{ textAlign: 'center' }}>
            <strong>江门：广东省轮滑技术水平等级测试（20191102期）</strong>
          </div>
        }
        bordered
        dataSource={data1}
        renderItem={item => (
          <List.Item>
            <Typography.Text strong>
              <a href={files_1102[item.id]}>[点击下载]</a>
            </Typography.Text>{' '}
            {item.title}
          </List.Item>
        )}
      />
      <footer className={styles['footer']}>
        <div>
          <span>
            广州青苔科技有限公司 版权所有{' '}
            <a target="_blank" href="http://beian.miit.gov.cn" style={{ color: '#939393' }}>
              粤ICP备20009053号-1
            </a>
          </span>
        </div>
        <div style={{ width: '300px', margin: '0 auto', padding: '20px 0' }}>
          <a
            target="_blank"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44011802000333"
            style={{
              display: 'inline-block',
              textDecoration: 'none',
              height: '20px',
              lineHeight: '20px',
            }}
          >
            <img src={p} style={{ float: 'left' }} alt="" />
            <p
              style={{
                float: 'left',
                height: '20px',
                lineHeight: '20px',
                margin: '0px 0px 0px 5px',
                color: '#939393',
              }}
            >
              粤公网安备 44011802000333号
            </p>
          </a>
        </div>
      </footer>
    </div>
  );
}
export default connect((model: any) => {
  return{
    downloadFileList: model?.download?.downloadFileList
  }
})(StaticDownload);
