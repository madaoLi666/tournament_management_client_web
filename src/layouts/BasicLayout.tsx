import React,{ ReactNode, useEffect } from 'react';
import { IRoute } from 'umi-types';
import { connect } from 'dva';
import router from 'umi/router';
import uRoutes from '@/config/router';

import { Layout, Menu, Breadcrumb, Drawer, Button, Avatar } from 'antd';
import { FaList, FaSearch, FaRegBell } from 'react-icons/fa';
// @ts-ignore
import styles from './index.less';
import { Dispatch } from 'redux';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;
const drawerStyle = {
  padding: '0px'
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

interface BasicProps {
  leaderName?: string
  unitName?: string
  athleteNumber?: number | null
  dispatch?: Dispatch
  children?: JSX.Element;
}

function BasicLayout(props: BasicProps) {
  // 默认不显示抽屉
  const [visible, setVisible] = React.useState(false);
  function showDrawer() {setVisible(!visible);}

  function signout() {
    // 清除TOKEN，并将store重新置空
    window.localStorage.clear();
    props.dispatch({
      type: 'user/clearstate',
      payload: null
    });
    router.push('/login')
  }

  useEffect(() => {
    props.dispatch({
      type:'user/getAccountData'
    })
  })

  return (
    <Layout style={{ minHeight: '100vh' }} className={styles['basic-layout']}>
      <Drawer
        title='标题'
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
      <Header style={{ background: '#fff', padding: 0 , height: 250}}>
        <div>
        <FaList className={styles['falist']} onClick={showDrawer} style={{width:28,height:28,marginLeft:16,marginTop:16}} />
        <Button type="link" onClick={signout} style={{float:"right",marginTop:"15px"}} >退出账号</Button>
        <FaRegBell className={styles['falist']} style={{float:"right",marginTop:"22px",width:20,height:20}} />
        <FaSearch className={styles['falist']} style={{marginRight:28,float:"right",marginTop:"22px",width:20,height:20}} />
        </div>
        <div>
          <Avatar style={{ backgroundColor: '#87d068' }} size={84} icon="user" />
          <p>早安，{}，祝你工作顺利</p>
        </div>
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
      </Footer>
    </Layout>
  );
}

const mapStateToProps = ({user}:any) => {
  let personMessage:BasicProps = {
    // leaderName: user.
  }
}

export default connect((store) => {
  return {
    // @ts-ignore

  }
})(BasicLayout)
