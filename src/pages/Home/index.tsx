import React, { useEffect } from 'react';
import {
  Carousel, Row, Col
} from 'antd';
import { getHomePic } from '@/services/gamelist.ts';
import router from 'umi/router';
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
  constructor(props: any) {
    super(props);
    this.state = {
      homePicArr: []
    };
  }

  componentDidMount(): void {
    getHomePic().then(res => {
      console.log(res);
      if(res.data.length !== 0 && res.error === "") {
        this.setState({homePicArr: res.data.map((v:any) => (v.file))});
      }else {
        console.log('图片获取失败');
      }
    })
  }

  render():React.ReactNode {
    const { gameList } = this.props;
    const { homePicArr } = this.state;
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
              <div><b>赛事名称</b>:{v.name}</div>
              <div><b>举办时间</b><span>:{v.rpstarttime.slice(0,10).replace(/-/g,"/")}~{v.rpendtime.slice(0,10).replace(/-/g,"/")}</span></div>
            </div>
            <a onClick={() => router.push(`/home/introduction?name=${encodeURI(v.name)}`)}>进入赛事</a>
          </div>
        </Col>
      )
    });

    let carouselDOM: React.ReactNode = [];
    if(homePicArr.length !== 0){
      carouselDOM = homePicArr.map((v:string) => (
        <div className={styles['carousel-item']} key={v.slice(-13,-5)}>
          <img src={v} alt=""/>
        </div>
      ));
    }

    return (
      <div className={styles['home-page']}>
        {/* 走马灯 */}
        <div>
          <Carousel autoplay={true} afterChange={() => {}} className={styles.carousel}>
            {carouselDOM}
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
