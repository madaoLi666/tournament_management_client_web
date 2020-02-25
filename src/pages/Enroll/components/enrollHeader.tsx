import React from 'react';
import styles from './index.less';

/*
  报名模块的页头,主要显示这一页的标题,以及可能右边放一个按钮设置操作
 */

interface EnrollHeaderProps {
  title: string;
  buttonDom?: React.ReactNode;
}

function EnrollHeader(props: EnrollHeaderProps) {
  const { title, buttonDom } = props;

  return (
    <>
      <div className={styles.title}>
        <span>{title}</span>
        {buttonDom ? buttonDom : null}
      </div>
      <div className={styles.hr} />
    </>
  );
}

export default EnrollHeader;
