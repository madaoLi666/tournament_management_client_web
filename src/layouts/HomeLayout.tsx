import React from 'react';
import {
  Layout, Row, Col, Input, Menu
} from 'antd'
// @ts-ignore
import styles from './index.less';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

function HomeLayout(props: any) {

  let menuArr:Array<object> = [
    { name: '主页', key: 'home', path: ''},
    { name: '自由式轮滑', key: 'f', path: ''},
    { name: '速度轮滑', key: 's', path: ''},
    { name: '轮滑球', key: 'b', path: ''},
    { name: '培训通知', key: 't', path: ''},
    { name: '业余等级考试', key: 'a', path: ''},
    { name: '小程序', key: 'p', path: ''},
  ];

  return (
    <div>
      <Layout className={styles['home-layout']}>
        <Header className={styles.header}>
          <Row type='flex' justify='start'>
            <Col span={2}><span>UseLessText</span></Col>
            <Col span={2} offset={14}><span>你好，请登录</span></Col>
            <Col span={2}><span>个人中心</span></Col>
            <Col span={2}><span>主办方中心</span></Col>
            <Col span={2}><span>客服中心</span></Col>
          </Row>
        </Header>
        <Content className={styles.content}>
          <Row>
            <Col span={4}><div className={styles.logo}>logo</div></Col>
            <Col span={10} offset={10}>
              <Search
                placeholder="input search text"
                onSearch={value => {}}
              />
            </Col>
          </Row>
          <div className={styles.menu}>

            <Menu mode="horizontal" >
              {(menuArr.map(v => {
                return (
                  // @ts-ignore
                  <Menu.Item key={v.key}>{v.name}</Menu.Item>
                )
              }))}
            </Menu>
          </div>
          <div>
            {props.children}
          </div>
        </Content>
        <Footer className={styles.footer}>
          The is Footer
        </Footer>
      </Layout>
    </div>
  )
}

export default HomeLayout;
