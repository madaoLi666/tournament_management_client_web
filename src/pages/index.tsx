import React from 'react';
import styles from './index.css';
import { connect, DispatchProp } from 'dva';


function UserIndex({dispatch}:DispatchProp) {

  React.useEffect(() => {
    dispatch({
      type:'user/getAccountData'
    })
  })

  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>To get started, edit <code>src/pages/index.js</code> and save to reload.</li>
        <li>
          <a href="https://umijs.org/guide/getting-started.html">
            Getting Started
          </a>
        </li>
      </ul>
    </div>
  );
}

export default connect()(UserIndex);
