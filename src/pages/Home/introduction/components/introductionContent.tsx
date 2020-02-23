import React from 'react';
import styles from './index.less';
import { Button, message } from 'antd';

interface IntroductionContentProps {
  matchData?: any;
  handleEnroll: Function;
}

function IntroductionContent(props: IntroductionContentProps) {
  const { matchData } = props;

  const download_url = matchData.matchannex.filter((v: any) => {
    return v.name.split('.')[0] === '自愿参赛责任书2019';
  });

  const ENROLL_DOM = (
    <h4>
      报名时间：{matchData.enrollstarttime.slice(0, 10)}至
      {matchData.enrollendtime.slice(0, 10)}
    </h4>
  );

  const IMG_DOM = <img src={matchData.image} alt="" />;

  const handleEnroll = () => {
    if (props.handleEnroll === undefined || props.handleEnroll === null) {
      message.error('[introductionContent]handle enroll is undefined!');
      return;
    }
    props.handleEnroll();
  };

  return (
    <header className={styles['pic-block']}>
      <div className={styles.img}>{IMG_DOM}</div>
      <div className={styles.text}>
        <h3>赛事名称:</h3>
        <h4>{matchData.name}</h4>
        <h3>报名时间</h3>
        {ENROLL_DOM}
        <Button className={styles.download}>
          <a href={download_url[0]['saveaddress']}>下载参赛自愿责任书</a>
        </Button>
        <Button type="primary" onClick={handleEnroll}>
          参加报名
        </Button>
        {/* <Button type='primary' onClick={() => { message.warning('现在不是报名时间') }}>参加报名</Button> */}
      </div>
    </header>
  );
}

export default IntroductionContent;
