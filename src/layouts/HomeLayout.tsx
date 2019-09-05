import React, { useEffect } from 'react';
import {
  Layout, Row, Col, Input, Menu, message
} from 'antd'
import { connect } from 'dva';
import router from 'umi/router';
// @ts-ignore
import styles from './index.less';

const { Header, Content, Footer } = Layout;

function HomeLayout(props: any) {

  let menuArr:Array<object> = [
    { name: '主页', key: 'home', path: ''},
    { name: '自由式轮滑', key: 'f', path: ''},
    { name: '速度轮滑', key: 's', path: ''},
    { name: '轮滑球', key: 'b', path: ''},
  ];

  const token = window.localStorage.getItem('TOKEN');

  function exit() {
    window.localStorage.clear();
    router.push('/home');
    message.info('退出登陆成功');
  }

  useEffect(() => {
    const { dispatch } = props;
    dispatch({type: 'gameList/getGameList'});
    const token = window.localStorage.getItem('TOKEN');
    if(token !== null){
      dispatch({type: 'user/getAccountData'});
    }
  });

  return (
    <div>
      <Layout className={styles['home-layout']}>
        <Header className={styles.header}>
          <div>
            <div style={{display: 'inline-block', float: 'left'}}>
              <span style={{width: '120px'}}>广东省轮滑运动协会赛事报名系统</span>
            </div>
            <div style={{display: 'inline-block', float: 'right'}}>
              {(token === null || token === undefined) ? (
                <a onClick={() => router.push('/login')} >你好，请登录</a>
              ) : (
                <span>
                  <a onClick={() => router.push('/user')}>个人中心</a>
                  &nbsp;&nbsp;
                  <a onClick={exit}>退出登陆</a>
                </span>
              )}
            </div>
          </div>
        </Header>

        <Content className={styles.content}>
            <div className={styles.logo}>
              <div>
                <img src={require('@/assets/logo1.png')} alt=""/>
                <span><b>广东省轮滑运动协会</b></span>
              </div>
              <div>
                <img src={require('@/assets/logo.png')} alt=""/>
                <span><b>赛事辅助系统平台</b></span>
              </div>
            </div>
            {/*<Col span={10} offset={10}>*/}
              {/*<Search*/}
                {/*placeholder="input search text"*/}
                {/*onSearch={value => {}}*/}
              {/*/>*/}
            {/*</Col>*/}
          <div className={styles.menu}>
            {/*<Menu mode="horizontal" >*/}
              {/*{(menuArr.map(v => {*/}
                {/*return (*/}
                  {/*// @ts-ignore*/}
                  {/*<Menu.Item key={v.key}>{v.name}</Menu.Item>*/}
                {/*)*/}
              {/*}))}*/}
            {/*</Menu>*/}
          </div>
          <div>
            {props.children}
          </div>
        </Content>
        <Footer className={styles.footer}>
          <div>
            <span>广州青苔科技有限公司 版权所有  粤ICP备19028504号</span>
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

export default connect()(HomeLayout);
