import * as React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './UserLayout.css';

export default function LoginLayout() {

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        <Link to="/">
                            <span className={styles.title}>This is a link</span>
                        </Link>
                    </div>
                    <div className={styles.desc}>轮滑赛事报名系统</div>
                </div>
            </div>
            <footer className={styles.clsString}>
                This is a footer
            </footer>
        </div>
    )
}
