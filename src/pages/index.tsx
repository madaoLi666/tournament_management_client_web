import React, { useEffect } from 'react';
import { Button } from 'antd';
import styles from './index.less';

export default function App(props: any) {
  useEffect(() => {
    console.log(props);
  });

  return (
    <div className={styles.normal}>
      <Button>hello next Antd</Button>
    </div>
  );
}
