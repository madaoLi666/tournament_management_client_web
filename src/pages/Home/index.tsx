import React, { useEffect, useState } from 'react';
import {
  Carousel, Row, Col
} from 'antd';
import { getGameList } from '@/services/gamelist';

// @ts-ignore
import styles from './index.less';



function Home() {

  const [gameList,setGameList] = useState([]);

  useEffect(() => {
    getGameList().then(res => {
      if(res.data !== '' && res.data ) setGameList(res.data)
    })
  },[]);

  return (
    <div className={styles['home-page']}>
      {/* 走马灯 */}
      <div>
        <Carousel autoplay={true} afterChange={() => {}} className={styles.carousel}>
          <div className={styles['carousel-item']}>
            <img src={require("@/assets/homepic1.jpg")} alt=""/>
          </div>
          <div className={styles['carousel-item']} >
            <img src={require("@/assets/homepic2.png")} alt=""/>
          </div>
        </Carousel>
      </div>
      {/* 赛事列表 */}
      <div className={styles['match-block']}>
        <h3>--&nbsp;&nbsp;推荐赛事&nbsp;&nbsp;--</h3>
        <div className={styles['match-list']}>
          <Row gutter={2}>
            <Col span={4}>赛事</Col>
            <Col span={4}>赛事</Col>
            <Col span={4}>赛事</Col>
            <Col span={4}>赛事</Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default Home
