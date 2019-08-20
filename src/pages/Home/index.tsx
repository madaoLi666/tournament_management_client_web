import React from 'react';
import {
  Carousel, Row, Col
} from 'antd';
import { connect } from 'dva';
import { ColProps } from 'antd/lib/grid';

// @ts-ignore
import styles from './index.less';

const adjustCol: ColProps = {
  xxl: {span: 5},
  xl: {span: 6},
  lg: {span: 6},
  md: {span: 12},
  sm: {span: 12},
  xs: {span: 24},
};



class Home extends React.Component<any,any>{


  componentDidMount(): void {
    const { dispatch } = this.props;
    dispatch({type: 'gameList/getGameList'});
  }



  render():React.ReactNode {
    const { gameList } = this.props;
    let gameListDOM: React.ReactNode = [];
    gameList.forEach((v:any) => {
      // @ts-ignore
      gameListDOM.push(
        <Col key={v.id} {...adjustCol} >
          <div className={styles['game-list-block']}>
            <div className={styles['img-block']}>
              <img src={v.image} alt=""/>
            </div>
            <div className={styles['text-block']}>
              <div><b>举办地点</b><span>：{v.rpaddress}</span></div>
              <div><b>举办时间</b><span>：{v.rpstarttime.slice(0,10).replace(/-/g,"/")}~{v.rpendtime.slice(0,10).replace(/-/g,"/")}</span></div>
            </div>
            <a href=''>进入赛事</a>
          </div>
        </Col>
      )
    });

    return (
      <div className={styles['home-page']}>
        {/* 走马灯 */}
        <div>
          <Carousel autoplay={true} afterChange={() => {}} className={styles.carousel}>
            <div className={styles['carousel-item']}>
              <img src={require("@/assets/homepic1.jpg")} alt=""/>
            </div>
            <div className={styles['carousel-item']} >
              <img src={require("@/assets/homepic2.jpg")} alt=""/>
            </div>
            <div className={styles['carousel-item']} >
              <img src={require("@/assets/homepic3.jpg")} alt=""/>
            </div>
          </Carousel>
        </div>
        {/* 赛事列表 */}
        <div className={styles['match-block']}>
          <h3>--&nbsp;&nbsp;推荐赛事&nbsp;&nbsp;--</h3>
          <div className={styles['match-list']}>
            <Row
              type='flex'
              justify='start'
              gutter={16}
            >
              {gameListDOM}
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({gameList}:any) => {
  return {gameList:gameList.gameList};
})(Home)
