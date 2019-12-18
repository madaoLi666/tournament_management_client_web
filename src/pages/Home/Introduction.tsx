import React from 'react';
import { Tabs, Button, Col, Row, message, Skeleton, Modal } from 'antd';
import StaticHtmlPage from '@/components/StaticHtmlPage/StaticHtmlPage'
import { connect } from 'dva';
import { Dispatch } from 'redux';
import router from 'umi/router';
// @ts-ignore
import styles from './index.less';

const { TabPane } = Tabs;

const imageItems: string[] = [
  'http://cos.gsta.top/sudulunhua.jpeg',
  'http://cos.gsta.top/lunhuaqiu.jpeg',
  'http://cos.gsta.top/ziyoushi.jpeg',
  'http://cos.gsta.top/zhiyoushi-1.png'
];

class IntroductionPage extends React.Component<{dispatch: Dispatch,gameList:Array<any>,unit_account: number,
  unitId: number},any> {

  constructor(props:any) {
    super(props);
    this.state = {
      currentGameData:{},
      gameList: []
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
      if(gameList[index].id === 12) {
        gameList[index].image = 'http://cos.gsta.top/sudulunhua.jpeg';
      }else if (gameList[index].id === 13) {
        gameList[index].image = 'http://cos.gsta.top/lunhuaqiu.jpeg';
      }else if(gameList[index].id === 14) {
        gameList[index].image = 'http://cos.gsta.top/ziyoushi.jpeg';
      }else if(gameList[index].id === 21) {
        gameList[index].image = 'http://cos.gsta.top/zhiyoushi-1.png';
      }
      this.setState({currentGameData: gameList[index]});
    }
  }

  onLoad(images: string) {
    this.setState(({gameList}: any) => {
      return { gameList: gameList.concat(images) };
    })
  }

  enterEnrollChannel = () => {
    const { dispatch, unit_account, unitId } = this.props;
    const { currentGameData } = this.state;
    console.log(unit_account);
    if(currentGameData.id !== undefined && currentGameData.id !== -1) {
      if(unit_account === 0){
        router.push('/enroll/individual');
      }
      if(unit_account === 2){
        // 把matchId存入本地
        window.localStorage.setItem('MATCH_ID',currentGameData.id);
        dispatch({type: 'enroll/getEnrollLimit', payload: { matchdata_id: currentGameData.id, unitdata_id: unitId },
          callback: (data: boolean) => {
            if(data) {
              dispatch({type: 'enroll/modifyCurrentMatchId', payload: {matchId: currentGameData.id}});
              router.push('/enroll/choiceTeam');
            }else {
              Modal.warning({
                title: '您的单位暂时报名不了本场赛事',
                content: '此为广东省轮滑运动协会会员单位杯，贵单位注册的名称为非会员，不能参赛，感谢您们的参与！如是会员需更正名称，请在个人中心中更新单位信息后 再进行报名。',
                okText: '确定'
              })
            }
          }
        });
      }else if(unit_account === 1){
        message.info('本系统暂不支持个人报名，请联系您的单位进行报名')
        return;
      }
    }else{
      console.log('id为空');
    }
  };

  render() {

    // 渲染
    const { currentGameData, gameList } = this.state;
    let IMG_DOM:React.ReactNode = <Skeleton key="skeleton" active />;
    let ENROLL_DOM:React.ReactNode = <Skeleton key="skeleton1" active />;
    let TAB_DOM = <TabPane tab='联系人' key="联系人" />;
    let download_url = [{saveaddress: ''}];
    if(Object.keys(currentGameData).length !== 0 && gameList.length === imageItems.length) {
      setTimeout(() =>{}
      ,500);
      IMG_DOM = <img src={currentGameData.image} alt='' />;
      ENROLL_DOM = <h4>报名时间：{currentGameData.enrollstarttime.slice(0,10)}至{currentGameData.enrollendtime.slice(0,10)}</h4>
      TAB_DOM = (
        <TabPane tab='联系人' key={String(Math.random())}>
          <p><strong>联系人：</strong>{currentGameData['leading_cadre']}</p>
          <p><strong>联系电话：</strong>{currentGameData['phone']}</p>
          <p><strong>报名时间：</strong>{currentGameData.enrollstarttime.slice(0,10)}至{currentGameData.enrollendtime.slice(0,10)}</p>
          <p><strong>主办方：</strong>{currentGameData.sponsor}</p>
        </TabPane>
      );
      download_url = currentGameData.matchannex.filter((v:any) => {
        return v.name.split('.')[0] === '自愿参赛责任书2019';
      });
    }

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
                {/* {currentGameData.id !== 21 ? <Button type='primary' onClick={() => {message.warning('现在不是报名时间')}}>参加报名</Button> */}
                {/* : <Button type='primary' onClick={() => this.enterEnrollChannel()}>参加报名</Button>} */}
                <Button type='primary' onClick={() => this.enterEnrollChannel()}>参加报名</Button>
                {/*<Button type='primary' onClick={() => {message.warning('现在不是报名时间')}}>参加报名</Button>*/}
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles['menu-block']} >
          <Tabs className={styles.tab} type='card' >
            {TAB_DOM}
            <TabPane tab='赛事章程' key='rules'>
              <div>
                <StaticHtmlPage index={currentGameData.id} />
              </div>
            </TabPane>
            <TabPane className={styles.tabPane} tab='参赛须知' key='known'>
              <p>1.报名需提供“真实姓名+身份证+手机号码”！（资料保密，绝不会泄漏）</p>
              <p>2.如时间或天气上有意外，根据实际情况的变化对行程进行适当调整。</p>
              <p>3.代他人报名者必须将以上注意事项告知被代报名参加者，凡报名者均视为接受本俱乐部声明，凡被代报名参加者均视为已通过代他人报名者知晓以上注意事项并接受本俱乐部声明及安排。</p>
            </TabPane>
          </Tabs>
        </div>
        {/*这里是隐藏加载图片*/}
        <div className={styles['hidden']}>
          {imageItems.map((item, i) =>
            <img
              src={item}
              onLoad={this.onLoad.bind(this, item)}
              key={i}
              alt=""
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(({gameList, enroll, user}:any) => {
  return {
    gameList: gameList.gameList,
    unitId: enroll.unitInfo.id,
    unit_account: user.unitAccount,
  };
})(IntroductionPage)
