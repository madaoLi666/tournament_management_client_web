import React, { useEffect } from 'react';
import { Button } from 'antd';
import styles from './index.less';

// function Test() {
//   useEffect(() => {
//     console.log(1);
//   });

//   return <div />;
// }

export default function () {
  // const app = '1';
  return (
    <div className={styles.normal}>
      <Button>hello next Antd</Button>
    </div>
  );
}
