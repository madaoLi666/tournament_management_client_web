import React, { useEffect } from 'react';
import { List, Card, PageHeader } from 'antd';
//@ts-ignore
import styles from './index.less';
import { getHomePic } from '@/services/gamelist.ts';

function StaticDownLoad() {

    const data = [
        {
          title: '粤轮协【2019】24号 关于举办《广东省轮滑技术水平等级测试（20191027期）》的通知',
          id:0,
        },
        {
          title: '附件2 广东省轮滑技术水平等级测试(20191027期）内容和标准',
          id:1
        },
        {
          title: '附件3：广东省轮滑技术水平等级测试（20191027期）报名表',
          id:2,
        },
        {
          title: '附件4：越级申请表（20191027期）',
          id:3,
        },
    ];

    const logo: React.ReactNode = (
        <div className={styles.logo}>
        <div style={{width:'100%'}} >
          <img src={require('@/assets/logo.png')} alt=""/>
          <span ><b style={{marginLeft:5}}>轮滑赛事辅助系统</b></span>
        </div>
      </div>
    )

    // 获取文件
    const [files,setFiles] = React.useState([]);
    useEffect(() => {
        getHomePic().then(data => {
            if(data) {
                setFiles(data.filter((m:any) => (m.id >= 16 && m.id <=19)).map((v:any) => (v.file)));
            }else {
              console.log('文件获取失败');
            }
          })
    },[]);

    return (

        
        <div className={styles['download']}>
            <header className={styles['header']}>
                <PageHeader title={logo}/>
                <span style={{height:20,marginTop:40}} >附件下载</span>
            </header>
            <List
                grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 3,
                }}
                className={styles['list']}
                dataSource={data}
                renderItem={item => (
                <List.Item>
                    <Card title={item.title}><a href={files[item.id]} >下载</a></Card>
                </List.Item>
                )}
            />
            <footer className={styles['footer']}>
                <div>
                    <span>广州青苔科技有限公司 版权所有  粤ICP备19028504号</span>
                </div>
                <div style={{width: '300px',margin:'0 auto', padding:'20px 0'}}>
                    <a
                    target="_blank"
                    href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44011802000333"
                    style={{display:'inline-block', textDecoration:'none', height: '20px', lineHeight: '20px'}}
                    >
                    <img src={require('../../assets/p.png')} style={{float: 'left'}} alt="" />
                    <p style={{float: 'left', height: '20px', lineHeight: '20px', margin: '0px 0px 0px 5px', color: '#939393'}} >
                    粤公网安备 44011802000333号</p>
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default StaticDownLoad;
