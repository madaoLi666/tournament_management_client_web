import React,{ ReactNode, useEffect } from 'react';
import { IRoute } from 'umi-types';
import { connect } from 'dva';
import router from 'umi/router';
import uRoutes from '@/config/router';

import { Layout, Menu, Breadcrumb, Icon, Drawer, Button } from 'antd';
// @ts-ignore
import styles from './index.less';

const { Header, Content, Footer, Sider } = Layout;
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

// 这里的props还没找到类型 暂时使用any
function BasicLayout(props: any) {
  // 默认不显示抽屉
  const [visible, setVisible] = React.useState(false);
  function showDrawer() {setVisible(!visible);}
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
      <Header style={{ background: '#fff', padding: 0 }}>
        <Button type="primary" onClick={showDrawer}>Open</Button>
      </Header>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: '#fff', minHeight: 720 }}>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>This is a Footer</Footer>
    </Layout>
  );
}

export default connect((store) => {
  console.warn('查看store中的数据');
  console.log(store);
  return {
    // @ts-ignore
    loading: store.loading.global
  }
})(BasicLayout)
