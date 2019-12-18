import React, { ReactNode, useEffect } from 'react';
import { IRoute } from 'umi-types';
import { connect } from 'dva';
import router from 'umi/router';
import uRoutes from '@/config/router';
import { Dispatch } from 'redux';
import ProLayout,{
  MenuDataItem,
  BasicLayout,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  PageHeaderWrapper,
} from '@ant-design/pro-layout';
import { Layout, Menu, Breadcrumb, Drawer, Button, Avatar, Typography, Row, Col, message, Icon } from 'antd';
// @ts-ignore
import styles from './index.less';
import { Link } from 'umi';

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
  if(routes === undefined || routes.length === 0){return <div>暂无路由数据</div>}
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

interface BasicLayoutProps extends ProLayoutProps {
  dispatch: Dispatch;
  children: React.ReactNode;
  userInfo: any;
  personInfo: any;
  drawer_visible: boolean;
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  collapsed: boolean;
}

function BasicLayoutMy(props: BasicLayoutProps) {
  const { dispatch } = props;

  useEffect(() => {
    props.dispatch({
      type:'user/getAccountData'
    });
    props.dispatch({
      type:'global/person_background_drawer',
      payload: false
    })
},[]);

  const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
    return (
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
    );
  };

  const handleMenuCollapse = (payload: boolean): void => {
    if(dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload
      })
    }
};

  const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
    menuList.map(item => {
      const localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children) : []
      };
      return localItem;
    });
    return menuList;
  };

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
      <BasicLayout
        title="轮滑辅助系统平台"
        logo={require('@/assets/logo.png')}
        collapsed={props.collapsed}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => {
          return [
            {
              path: '/',
              breadcrumbName: "运动员列表"
            },
            ...routers,
          ]}}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuDataRender={menuDataRender}
        footerRender={footerRender}
        rightContentRender={rightProps => (
          <div style={{display: 'inline', float: 'right'}} >
            <Button type="link" onClick={signout} >退出账号</Button>
            <Button type="link" onClick={() => {router.push('/home')}} >返回主页</Button>
          </div>
        )}
        {...props}
        {...props.settings}
      >
        <div className={styles.headerBlock} style={{ background: '#ffffff', height: "100%"}}>
          <Row>
            <Col {...autoAdjust1}>
              <div >
                <div className={styles.headerMessage} >
                  <Avatar className={styles.Avatar} style={{ backgroundColor: '#87d068',marginTop:16,marginBottom:16,marginLeft: 16 }} size={84} icon="user" />
                  <div style={{display:"flex",flexWrap:"wrap",width:300,marginLeft:20}}>
                    <p style={{fontSize:18,marginTop:24}} >您好，{leaderName === undefined ? person_name : leaderName}，祝您工作顺利</p>
                    {unitName === undefined ? null : <p><strong>赛事职务：{unitName === undefined ? null : unitName}&nbsp;领队</strong></p>}
                  </div>
                </div>
              </div>
            </Col>
            <Col {...autoAdjust2}>
              {unitName === undefined ? null :
                <div className={styles.headerMessageRight}>
                  <Text type="secondary">在册运动员</Text>
                  <Title className={styles.athNum} level={1} >{athleteNumber === undefined ? null : athleteNumber}</Title>
                </div>
              }
            </Col>
          </Row>
          <div className={styles.split} />
          {props.children}
        </div>
      </BasicLayout>
  );
}

const mapStateToProps = (state:any) => {
  if(state.user.unitData !== undefined) {
    if (state.user.unitData.length === 0) {
      if(state.user.unitAccount === 1) {
        return {
          collapsed: state.global.collapsed,
          personInfo: state.user.athleteData,
          drawer_visible: state.global.drawer_visible
        };
      }else {
        return {collapsed: state.global.collapsed,
          drawer_visible: state.global.drawer_visible };
      }
    }
  }
  if(state.user.id !== ''){
    return {collapsed: state.global.collapsed, userInfo: state.user, drawer_visible: state.global.drawer_visible};
  }
  return {collapsed: state.global.collapsed, drawer_visible: state.global.drawer_visible }
};

export default connect(mapStateToProps)(BasicLayoutMy);
