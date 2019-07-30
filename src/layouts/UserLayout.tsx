import * as React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './UserLayout.css';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

export default function LoginLayout(props:any) {

    return (
        <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.top}>
                <div className={styles.header}>
                    <Link to="/">
                        <span className={styles.title}>This is a link</span>
                    </Link>
                </div>
                <div className={styles.desc}><h2>登陆</h2></div>
            </div>
        </div>
        <main>
            {props.children}
        </main>
        <footer className={styles.clsString}>
            This is a footer
        </footer>
    </div>
    )
}
