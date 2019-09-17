import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
// @ts-ignore
import styles from './index.less';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

interface PersonSettingProps {

}

interface PersonSettingState {

}

class PersonSetting extends Component<PersonSettingProps,PersonSettingState> {
    constructor(props: PersonSettingProps) {
        super(props);
    }

    render() {
        return (
            <Layout style={{backgroundColor:'#FFFFFF'}}>
                <Sider width={250} style={{height:'auto'}}>
                    <Menu 
                        mode='inline'
                        defaultSelectedKeys={['1']} 
                        defaultOpenKeys={['sub1']} 
                        style={{height:'auto' , backgroundColor:'#FFFFFF',}}
                    >
                        <Menu.Item key="1">账号设置</Menu.Item>
                        <Menu.Item key="2">单位设置</Menu.Item>
                    </Menu>
                </Sider>
                <Content>

                </Content>
            </Layout>
        )
    }
}

export default PersonSetting;