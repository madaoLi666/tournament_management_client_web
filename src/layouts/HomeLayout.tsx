import React, { useEffect, useState } from 'react';
import {
  Layout, message, Row, Col, Menu, Icon,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Dispatch } from 'redux';
// @ts-ignore
import styles from './index.less';

const { Header, Content, Footer } = Layout;

interface HomeLayoutProps {
  dispatch: Dispatch;
  children: React.ReactNode;
}

function HomeLayout(props: HomeLayoutProps) {

  let menuArr:Array<object> = [
    { name: '主页', key: 'home', path: ''},
    { name: '自由式轮滑', key: 'f', path: ''},
    { name: '速度轮滑', key: 's', path: ''},
    { name: '轮滑球', key: 'b', path: ''},
  ];

  const token = window.localStorage.getItem('TOKEN');
  const [currentMenu, setCurrentMenu] = useState('home');
  function exit() {
    window.localStorage.clear();
    props.dispatch({
      type: 'user/clearstate',
      payload: ''
    });
    props.dispatch({
      type: 'enroll/clearstate',
      payload: ''
    });
    router.push('/home');
    message.info('退出登陆成功');
  }

  const [loading,setLoading] = useState(false);
  useEffect(() => {
    const { dispatch } = props;
    /* 这里加多一个callback，用以防止401时重复请求 */
    dispatch({type: 'gameList/getGameList',
      callback: (data: any) => {
        if(data !== undefined && token !== null){
          dispatch({type: 'user/getAccountData'});
        }
      }
    });
  },[]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    },1000)
  },[props]);

  function handleChangeMenu(e: any) {
    setCurrentMenu(e.key);
    if (e.key === 'home') {
      router.push('/home')
    }else {
      router.push('/home/temp');
    }
  }

  if(!loading) {
    return (
      <div className={styles['mask']} hidden={loading} >
      <div className={styles['mask-box']}>
          加载中
          <span className={styles['d']}>.</span><span className={styles['d d-2']}>.</span><span className={styles['d d-3']}>.</span>
      </div>
    </div>
    )
  }else return (
    <div>
      <Layout className={styles['home-layout']} >
        <Header className={styles['header']}>
            <div className={styles.header_left}>
              <strong>
                <div>
                  <img src={require('@/assets/logo.png')}  alt=""/>
                  <span ><a href={"/home"} >轮滑赛事辅助系统平台</a></span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
              <a className={styles.header_block} onClick={() => window.open('https://www.gsta.top/nstatic/react/%E6%8A%A5%E5%90%8D%E6%AD%A5%E9%AA%A4_6fDXGU2.html')} >报名步骤查看</a>
              </strong>
            </div>
            <div className={styles.header_right}>
              {(token === null || token === undefined) ? (
                <div>
                <a onClick={() => router.push('/home')}>主页</a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={() => router.push('/login')} >你好，请登录</a>
                </div>
              ) : (
                <span>
                  <a onClick={() => router.push('/user/list')}>个人中心</a>
                  &nbsp;&nbsp;
                  &nbsp;&nbsp;
                  <a onClick={exit}>退出登陆</a>
                </span>
              )}
            </div>
        </Header>

        <Content className={styles.content}>
            <div className={styles.logo}>
              <div>
                <img src={require('@/assets/logo1.png')}  alt=""/>
                <span style={{padding:5}} ><b>广东省轮滑运动协会</b></span>
              </div>
              <div className={styles.logo_my} >
                <img src={require('@/assets/logo.png')} alt=""/>
                <span style={{padding:5}} ><b>轮滑赛事辅助系统</b></span>
              </div>
            </div>
          <div className={styles.menu}>
            <Menu onClick={handleChangeMenu} selectedKeys={[currentMenu]} mode={"horizontal"} >
              <Menu.Item key={"home"} >
                <Icon type={"home"} />
                主页
              </Menu.Item>
              <Menu.Item key={"competition"} >
                <Icon type={"crown"} />
                赛事
              </Menu.Item>
              <Menu.Item key={"practice"} >
                <Icon type={"project"} />
                培训
              </Menu.Item>
              <Menu.Item key={"level"} >
                <Icon type={"heat-map"} />
                业余等级
              </Menu.Item>
              <Menu.Item key={"small_program"} >
                <Icon type={"wechat"} />
                小程序
              </Menu.Item>
            </Menu>
          </div>
          <div>
            {props.children}
          </div>
        </Content>
        <Footer className={styles.footer}>
          <div>
          <span>广州青苔科技有限公司 版权所有  <a target="_blank" href='http://beian.miit.gov.cn' style={{ color: '#939393'}}>粤ICP备19028504号</a></span>
          </div>
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
    </div>
  )
}

/*
*   通过connect 拿到modal(user.ts)中
*   信息判断 是否有登陆 有 显示信息 无 原本页面
* */

const mapStateToProps = ({gameList}:any) => {
  return {
    maskloading: gameList.maskloading,
  }
};

export default connect(mapStateToProps)(HomeLayout);

/**
 *   // 报名步骤
  useEffect(() => {
    if(closeModal) {
      Modal.info({
        title: '若第一次登录本系统或对报名有疑问可查看该报名步骤',
        content: (
          <div>
            <a onClick={() => window.open('https://www.gsta.top/nstatic/react/%E6%8A%A5%E5%90%8D%E6%AD%A5%E9%AA%A4_6fDXGU2.html')} >报名步骤查看</a>
          </div>
        ),
        onOk() {
          dispatch({
            type: 'global/closeModal',
            payload: false
          });
          notification.open({
            message: '可在页面左上方再次查看报名步骤',
            duration: 3,
            placement: "topLeft"
          });
        },
        okText:"知道了",
      });
    }
  },[]);
 * */
