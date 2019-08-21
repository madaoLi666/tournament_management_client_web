import React from 'react';
import { Tabs, Button } from 'antd';
import moment from 'moment'
import { connect } from 'dva';
// @ts-ignore
import styles from './index.less';

const { TabPane } = Tabs;

class IntroductionPage extends React.Component<any,any> {

  constructor(props:any) {
    super(props);
    this.state = {
      currentGameData:{}
    };
  }

  componentDidMount(): void {
    const { gameList } = this.props;
    const name = decodeURIComponent(window.location.search.split('=')[1]);
    let index:number = -1;
    for(let i = gameList.length - 1 ; i >= 0 ; i--) {
      if(name === gameList[i].name) {
        index = i;
        break;
      }
    }
    if(index !== -1){
      this.setState({currentGameData: gameList[index]});
    }
  }

  render() {
    const { currentGameData } = this.state;
    let IMG_DOM:React.ReactNode = <div>image</div>;
    let ENROLL_DOM:React.ReactNode = <div>image</div>;
    let TAB_DOM = <div>暂无数据</div>;
    let download_url = [{saveaddress: ''}];
    if(Object.keys(currentGameData).length !== 0) {
      IMG_DOM = <img src={currentGameData.image} alt='' />;
      ENROLL_DOM = <h4>报名时间：{currentGameData.enrollstarttime.slice(0,10)}至{currentGameData.enrollendtime.slice(0,10)}</h4>
      TAB_DOM = (
        <Tabs type='card'>
          <TabPane tab='联系人' key={Math.random().toString()}>
            <p>联系人：{currentGameData['leading_cadre']}</p>
            <p>联系电话：{currentGameData['phone']}</p>
            <p>报名时间：{currentGameData.enrollstarttime.slice(0,10)}至{currentGameData.enrollendtime.slice(0,10)}</p>
            <p>主办方：{currentGameData.organizer}</p>
          </TabPane>
        </Tabs>
      );
      download_url = currentGameData.matchannex.filter((v:any) => {
        return v.name.split('.')[0] === '自愿参赛责任书';
      });
    }

    return (
      <div className={styles['introduction-page']}>
        <div className={styles['pic-block']}>
          <div className={styles.img}>
            {IMG_DOM}
          </div>
          <div className={styles.text}>
            <div className={styles.left}>
              <h4>{currentGameData.name}</h4>
              {ENROLL_DOM}
            </div>
            <div className={styles.right}>
              <div>
                {currentGameData ? <a href={download_url[0]['saveaddress']}>参赛自愿责任书</a> : <div>数据尚未加载</div>}
              </div>
              <Button type='primary'>参加报名</Button>
            </div>
          </div>
        </div>
        <div className={styles['menu-block']} >
          {TAB_DOM}
        </div>
      </div>
    )
  }
}


export default connect(({gameList}:any) => {
  return {gameList: gameList.gameList};
})(IntroductionPage)
