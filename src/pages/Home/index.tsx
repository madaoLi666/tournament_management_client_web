import React from 'react';
import {
  Carousel, Row, Col, Skeleton
} from 'antd';
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
      homePicArr: [],
      loading: false,
      small_homePicArr: []
    };
  }

  onLoad(images: string) {
    this.setState(({homePicArr}: any) => {
      return { homePicArr: homePicArr.concat(images) };
    })
  }

  onLoadSmall(images: string) {
    this.setState(({small_homePicArr}: any) => {
      return { small_homePicArr: small_homePicArr.concat(images) };
    })
  }

  render():React.ReactNode {
    const { gameList } = this.props;
    const { homePicArr, small_homePicArr } = this.state;
    let gameListDOM: React.ReactNode = [];
    const new_homePicArr: string[] = [
      'http://cos.gsta.top/1.jpg',
      'http://cos.gsta.top/2.jpg',
      'http://cos.gsta.top/3.jpg',
    ];
    const small_new_homePicArr: string[] = [
      'http://cos.gsta.top/zhiyoushi-1.png',
      'http://cos.gsta.top/ziyoushi.jpeg',
      'http://cos.gsta.top/lunhuaqiu.jpeg',
      'http://cos.gsta.top/sudulunhua.jpeg',
    ];
    if(small_homePicArr.length === small_new_homePicArr.length) {
      gameList.forEach((v:any,index:any) => {
        // @ts-ignore
        gameListDOM.push(
          <Col key={v.id} {...adjustCol} >
            <div className={styles['game-list-block']}>
              <div className={styles['img-block']}>
                <img src={small_new_homePicArr[index]} onClick={() => router.push(`/home/introduction?name=${encodeURI(v.name)}`)} alt=""/>
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
    }else {
      gameList.forEach((v:any,index:any) => {
        // @ts-ignore
        gameListDOM.push(
          <Col key={v.id} {...adjustCol} >
            <div className={styles['game-list-block']}>
              <div className={styles['img-block']}>
                <Skeleton key="skeleton" active />
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
    }
    let carouselDOM: React.ReactNode = [];
    if(homePicArr.length === new_homePicArr.length){
      carouselDOM = new_homePicArr.map((v:string) => (
        <div className={styles['carousel-item']} key={v.slice(-13,-5)}>
          <img src={v} alt=""/>
        </div>
      ));
    }else {
      carouselDOM = new_homePicArr.map((v:string) => (
        <Skeleton key="skeleton1" active />
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
        <div className={styles['hidden']}>
          {new_homePicArr.map((item, i) =>
            <img
              src={item}
              onLoad={this.onLoad.bind(this, item)}
              key={i}
              alt=""
            />
          )}
          {small_new_homePicArr.map((item, i) =>
            <img
              src={item}
              onLoad={this.onLoadSmall.bind(this, item)}
              key={i}
              alt=""
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(({gameList}:any) => {
  return {gameList:gameList.gameList};
})(Home)
