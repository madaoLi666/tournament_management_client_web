import React from 'react';
import { Tabs, Button, Col, Row, message } from 'antd';
import StaticHtmlPage from '@/components/StaticHtmlPage/StaticHtmlPage'
import { connect } from 'dva';
import { Dispatch } from 'redux';
import router from 'umi/router';
// @ts-ignore
import styles from './index.less';

const { TabPane } = Tabs;

class IntroductionPage extends React.Component<{dispatch: Dispatch,gameList:Array<any>},any> {

  constructor(props:any) {
    super(props);
    this.state = {
      currentGameData:{}
    };
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
    const { gameList } = this.props;
    const { currentGameData } = this.state;
    const name = decodeURIComponent(window.location.search.split('=')[1]);
    let index:number = -1;
    for(let i = gameList.length - 1 ; i >= 0 ; i--) {
      if(name === gameList[i].name) {
        index = i;
        break;
      }
    }
    if(index !== -1 && Object.keys(currentGameData).length === 0){
      this.setState({currentGameData: gameList[index]});
    }
  }

  enterEnrollChannel = () => {
    // message.warn('尚未到报名时段');
    const { dispatch } = this.props;
    const { currentGameData } = this.state;
    if(currentGameData.id !== undefined && currentGameData.id !== -1) {

      // 把matchId存入本地
      window.localStorage.setItem('MATCH_ID',currentGameData.id);
      dispatch({type: 'enroll/modifyCurrentMatchId', payload: {matchId: currentGameData.id}});
      router.push('/enroll/editUnitInfo');
    }else{
      console.log('id为空');
    }
  };

  render() {

    // 渲染
    const { currentGameData } = this.state;
    let IMG_DOM:React.ReactNode = <div>image</div>;
    let ENROLL_DOM:React.ReactNode = <div>image</div>;
    let TAB_DOM = <TabPane tab='联系人' key="联系人" />;
    let download_url = [{saveaddress: ''}];
    if(Object.keys(currentGameData).length !== 0) {
      IMG_DOM = <img src={currentGameData.image} alt='' />;
      ENROLL_DOM = <h4>报名时间：{currentGameData.enrollstarttime.slice(0,10)}至{currentGameData.enrollendtime.slice(0,10)}</h4>
      TAB_DOM = (
        <TabPane tab='联系人' key={String(Math.random())}>
          <p>联系人：{currentGameData['leading_cadre']}</p>
          <p>联系电话：{currentGameData['phone']}</p>
          <p>报名时间：{currentGameData.enrollstarttime.slice(0,10)}至{currentGameData.enrollendtime.slice(0,10)}</p>
          <p>主办方：{currentGameData.sponsor}</p>
        </TabPane>
      );
      download_url = currentGameData.matchannex.filter((v:any) => {
        return v.name.split('.')[0] === '自愿参赛责任书';
      });
    }



    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
      <div className={styles['introduction-page']}>
        <div className={styles['pic-block']}>
          <div className={styles.img}>
            {IMG_DOM}
          </div>
          <div className={styles.text}>
            <Row>
              <Col lg={{span: 12}} sm={{span: 12}} xs={{span: 24}}>
                <h4>{currentGameData.name}</h4>
                {ENROLL_DOM}
              </Col>
              <Col lg={{span: 12}} sm={{span: 12}} xs={{span: 24}}>
                {currentGameData ? <span>下载：<a href={download_url[0]['saveaddress']}>参赛自愿责任书</a></span> : <div>数据尚未加载</div>}
                <br/>
                <Button type='primary' onClick={() => this.enterEnrollChannel()}>参加报名</Button>
                {/* <Button type='primary' onClick={() => {message.warning('现在不是报名时间，请先查看赛事章程')}}>参加报名</Button> */}
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles['menu-block']} >
          <Tabs type='card' >
            {TAB_DOM}
            <TabPane tab='赛事章程' key='rules'>
              <div>
                <StaticHtmlPage index={currentGameData.id} />
              </div>
            </TabPane>
            <TabPane tab='参赛须知' key='known'>
              <p>1.报名需提供“真实姓名+身份证+手机号码”！（资料保密，绝不会泄漏）</p>
              <p>2.如时间或天气上有意外，根据实际情况的变化对行程进行适当调整。</p>
              <p>3.代他人报名者必须将以上注意事项告知被代报名参加者，凡报名者均视为接受本俱乐部声明，凡被代报名参加者均视为已通过代他人报名者知晓以上注意事项并接受本俱乐部声明及安排。</p>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}


export default connect(({gameList, enroll}:any) => {
  return {
    gameList: gameList.gameList,
    unitId: enroll.unitInfo.id
  };
})(IntroductionPage)
