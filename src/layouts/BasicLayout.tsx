import React,{ ReactNode, useEffect } from 'react';
import { IRoute } from 'umi-types';
import { connect } from 'dva';
import router from 'umi/router';
import uRoutes from '@/config/router';

import { Layout, Menu, Breadcrumb, Drawer, Button, Avatar, Typography, Row, Col, message, Icon } from 'antd';
// @ts-ignore
import styles from './index.less';

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;
const { SubMenu } = Menu;
const drawerStyle = {
  padding: '0px'
};

// Col 自适应
const autoAdjust1 = {
  xs: { span: 24 },
  sm: { span: 14 },
  md: { span: 10 },
  lg: { span: 10 },
};

const autoAdjust2 = {
  xs: { span: 24 },
  sm: { span: 6,offset:4 },
  md: { span: 4,offset:10 },
  lg: { span: 4,offset:10 },
};

// 初始化菜单栏的Function 内部方法
function initialMenuDOM(routes: IRoute): ReactNode{
  let menuDOM:Array<ReactNode> = [];
  if(routes == undefined || routes.length === 0){return <div>暂无路由数据</div>}
  // 遍历
  routes.forEach((v:IRoute) => {
    // 是否需要渲染
    if(v.hasOwnProperty('isRender') && v.isRender){
      // 是否需要渲染子路由
      if(v.hasOwnProperty('routes') && v.routes !== undefined && v.routes.length !== 0){
        // 需要渲染子路由
        let childRoutes:Array<ReactNode> = [];
        // 生成子路由
        v.routes.forEach((v:IRoute) => {
          childRoutes.push(
            //@ts-ignore
            <Menu.Item key={v.path} onClick={() => {router.push(v.path)}}>
              <span>{v.name}</span>
            </Menu.Item>
          );
        });
        menuDOM.push(<SubMenu key={v.path} title={v.name}>{childRoutes}</SubMenu>)
      }else{
        // 不需要渲染子路由
        menuDOM.push(
          //@ts-ignore
          <Menu.Item key={v.path} onClick={() => {router.push(v.path)}}>
            <span>{v.name}</span>
          </Menu.Item>
        );
      }
    }
  });
  return menuDOM;
}

function BasicLayout(props: any) {
  useEffect(() => {
    props.dispatch({
      type:'user/getAccountData'
    })
  },[]);

  let leaderName:string;
  let unitName:string;
  let person_name:string;
  let athleteNumber: number;
  if(props.userInfo) {
    // 判断是否有单位账号信息
    leaderName = props.userInfo.athleteData[0].name;
    unitName = props.userInfo.unitData[0].name;
    athleteNumber = props.userInfo.unitathlete.length;
  }
  if(props.personInfo) {
    if(props.personInfo.length !== 0) {
      person_name = props.personInfo[0].name;
    }
  }

  // 默认不显示抽屉
  const [visible, setVisible] = React.useState(false);
  function showDrawer() {setVisible(!visible);}

  function signout() {
    // 清除TOKEN，并将store重新置空
    window.localStorage.clear();
    props.dispatch({
      type: 'user/clearstate',
      payload: ''
    });
    props.dispatch({
      type: 'enroll/clearstate',
      payload: ''
    });
    message.info('退出成功');
    router.push('/home')
  }

  return (
    <Layout style={{ minHeight: '100vh' }} className={styles['basic-layout']}>
      <Drawer
        title='赛事平台辅助系统'
        placement='left'
        closable={false}
        onClose={showDrawer}
        visible={visible}
        bodyStyle={drawerStyle}
      >
        <div className={styles['logo']}>
          <Menu theme='light' mode='inline'>
            {/* 动态渲染 */}
            {initialMenuDOM(uRoutes)}
          </Menu>
        </div>
      </Drawer>
      <Header style={{ background: '#fff', padding: 0 , height: "100%"}}>
        <div>
          <Icon className={styles['falist']} onClick={showDrawer} style={{width:28,height:28,marginLeft:16,marginTop:16}} type="unordered-list" />
        <Button type="link" onClick={signout} style={{float:"right",marginTop:"15px"}} >退出账号</Button>
        </div>
        <Row style={{height:130}}>
          <Col {...autoAdjust1}>
            <div style={{marginBlock:0}}>
              <div className={styles['headerMessage']} style={{display:"flex",marginLeft:16}} >
                <Avatar style={{ backgroundColor: '#87d068',marginTop:20 }} size={84} icon="user" />
                <div style={{display:"flex",flexWrap:"wrap",width:300,marginLeft:20}}>
                  <p style={{fontSize:18,marginTop:8}} >早安，{leaderName === undefined ? person_name : leaderName}，祝你工作顺利</p>
                  {unitName === undefined ? null : <p><strong>赛事职务：{unitName === undefined ? null : unitName}&nbsp;领队</strong></p>}
                </div>
              </div>
            </div>
          </Col>
          <Col {...autoAdjust2}>
            {unitName === undefined ? null :
              <div style={{marginLeft:30}}>
              <Text type="secondary">在册运动员</Text>
              <Title style={{margin:0,marginLeft:20}} level={1} >{athleteNumber === undefined ? null : athleteNumber}</Title>
              </div>
            }
          </Col>
        </Row>
      </Header>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>个人中心</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: '#fff', minHeight: 720 }}>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
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

const mapStateToProps = (state:any) => {
  if(state.user.unitData !== undefined) {
    if (state.user.unitData.length === 0) {
      if(state.user.unitAccount === 1) {
        return {
          personInfo: state.user.athleteData
        };
      }else {
        return {};
      }
    }
  }
  if(state.user.id !== ''){
    return { userInfo: state.user};
  }
  return {}
};

export default connect(mapStateToProps)(BasicLayout);
