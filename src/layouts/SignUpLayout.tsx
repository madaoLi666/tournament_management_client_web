import * as React from 'react';
import { Layout } from 'antd';

const { Header,Content,Footer } = Layout;

export default function SignUP() {

    return (
        <Layout style={{minHeight:1080}}>
            <Header style={{backgroundColor:'#F0F2F5'}} >
                This is Header
            </Header>
            <Content>
                <div style={{textAlign:'center',fontSize:'24px',marginTop:90}}>
                    <h2>报名通道</h2>
                </div>
                <p style={{textAlign:'center'}}>Below is an example form built entirely with Bootstrap's form controls. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
            </Content>
            <Footer>This is Footer</Footer>
        </Layout>
    )
}
