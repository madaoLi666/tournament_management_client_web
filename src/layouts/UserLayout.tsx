import React from 'react';
// @ts-ignore
import styles from './index.less';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

export default function LoginLayout(props: any) {

  const { children } = props;

  // useEffect(() => {
  //   const LOGIN_PATH:string = '/login';
  //   const token = window.localStorage.getItem('TOKEN');
  //   const pathName = window.location.pathname;
  //   if(token === null || token === undefined ) {
  //     if(pathName !== LOGIN_PATH){
  //       router.push(LOGIN_PATH);
  //     }
  //   }
  // });

  return (
    <Layout className={styles['login-layout']} style={{ minHeight: '100vh' }}>
      <Header className={styles.header}>
        <p><strong>轮滑赛事辅助系统平台</strong></p>
      </Header>

      <Content className={styles.content} >
        {children}
      </Content>

      <Footer className={styles.footer}>
        <span>广州青苔科技有限公司 版权所有  粤ICP备19028504号</span>
        <div style={{width: '300px',margin:'0 auto', padding:'20px 0'}}>
            <a
              target="_blank"
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44011802000333"
              style={{display:'inline-block', textDecoration:'none', height: '20px', lineHeight: '20px'}}
            >
              <img src={require('../assets/p.png')} style={{float: 'left'}} alt="" />
              <p style={{float: 'left', height: '20px', lineHeight: '20px', margin: '0px 0px 0px 5px', color: '#939393'}} >
              粤公网安备 44011802000333号</p>
            </a>
          </div>
      </Footer>
    </Layout>
  );
}
