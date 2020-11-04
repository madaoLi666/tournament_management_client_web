import React from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import StaticHtmlPage from '@/components/StaticHtmlPage/StaticHtmlPage';

const { TabPane } = Tabs;

interface IntroductionFooterProps {
  matchData?: any;
}

function IntroductionFooter(props: IntroductionFooterProps) {
  const { matchData } = props;

  const TAB_DOM: React.ReactNode = (
    <TabPane tab="联系人" key={String(Math.random())}>
      <p>
        <strong>联系人：</strong>
        {matchData['leading_cadre']}
      </p>
      <p>
        <strong>联系电话：</strong>
        {matchData['phone']}
      </p>
      <p>
        <strong>报名时间：</strong>
        {matchData.enrollstarttime.slice(0, 10)}至
        {matchData.enrollendtime.slice(0, 10)}
      </p>
      <p>
        <strong>主办方：</strong>
        {matchData.sponsor}
      </p>
    </TabPane>
  );

  return (
    <div className={styles['menu-block']}>
      <Tabs className={styles.tabColor} type="card">
        {TAB_DOM}
        <TabPane tab="赛事章程" key="rules">
          <div>
            <StaticHtmlPage index={matchData.id} />
          </div>
        </TabPane>
        <TabPane className={styles.tabPane} tab="参赛须知" key="known">
          <p>
            1.报名需提供“真实姓名+身份证+手机号码”！（资料保密，绝不会泄漏）
          </p>
          <p>2.如时间或天气上有意外，根据实际情况的变化对行程进行适当调整。</p>
          <p>
            3.代他人报名者必须将以上注意事项告知被代报名参加者，凡报名者均视为接受本声明，凡被代报名参加者均视为已通过代他人报名者知晓以上注意事项并接受本声明及安排。
          </p>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default IntroductionFooter;
