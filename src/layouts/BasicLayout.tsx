import * as React from 'react';
import styles from './BasicLayout.css';
import { Layout,Menu,Breadcrumb,Icon,Drawer,Button } from 'antd';

enum LinkList {     // 页面链接的key
    Information = 1,
    Athletes,
    Account,
    Grade
}

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function Basic() {
    const [collapsed, setCollapsed] = React.useState(false);
    const [visible, setVisible] = React.useState(false);   // 默认不显示抽屉

    function setcoll() {        // 导航栏的函数
        setCollapsed(!collapsed);
    }

    function showDrawer() {
        setVisible(!visible);
    }

    return (
        <Layout style={{ minHeight: '100vh' }} >
            <Drawer title='标题' placement='left' closable={false} onClose={showDrawer} visible={visible} >
            <div className={styles.logo}>
                <Menu theme='light' defaultSelectedKeys={[`${LinkList.Information}`]} mode='inline' >
                    <Menu.Item key={LinkList.Information}>
                    <Icon type="pie-chart" />
                    <span>资讯展示</span>
                    </Menu.Item>
                    <Menu.Item key={LinkList.Athletes}>
                    <Icon type="desktop" />
                    <span>运动员信息</span>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="user" /><span>User</span></span>}>
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
            </Drawer>
            <Layout>
                <Header style={{background: '#fff',padding:0}}  />
                <Content style={{margin: '0 16px'}} >
                    <Breadcrumb style={{margin:'16px 0'}}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item><Button type="primary" onClick={showDrawer}>
                        Open
                        </Button></Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{padding:24,background:'#fff',minHeight:720}} >1                           
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>This is a Footer</Footer>
            </Layout>
        </Layout>
    )
}
