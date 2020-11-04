import React, { useEffect, useState } from 'react';
import styles from './home.less';
import { ColProps } from 'antd/lib/grid';
import { Button, Carousel, Col, Menu, Row, Skeleton, Tag } from 'antd';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { router } from 'umi';
import {
  CrownOutlined,
  HeatMapOutlined,
  ProjectOutlined,
  WechatOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const adjustCol: ColProps = {
  xxl: { span: 5 },
  xl: { span: 6 },
  lg: { span: 6 },
  md: { span: 12 },
  sm: { span: 12 },
  xs: { span: 24 },
};

// 轮播图
const new_homePicArr: string[] = [
  'http://cos.gsta.top/1.jpg',
  'http://cos.gsta.top/2.jpg',
  'http://cos.gsta.top/3.jpg',
];
// 赛事图
const small_new_homePicArr: string[] = [
  'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/2020LunHua.jpg',
  'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/2020SuHua.jpg',
  'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/img/WechatIMG3604.png',
  'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/img/WechatIMG3586.jpeg',
  'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/img/WechatIMG178.jpeg',
  'http://cos.gsta.top/2020shaoguanyaoqing.jpeg',
  'http://cos.gsta.top/zhiyoushi-1.png',
  'http://cos.gsta.top/ziyoushi.jpeg',
  'http://cos.gsta.top/lunhuaqiu.jpeg',
  'http://cos.gsta.top/sudulunhua.jpeg',
];

interface HomeProps {
  gameList?: Array<any>;
}

/*
  整个组件的预加载思想是：先加载图片，但是所有图片包裹在display: none的样式里面
  然后当图片都加载完了，即 homeImgArr和 matchImgArr 已经更改到上面的图片数组了
  然后使用useEffect来push两个图片的DOM节点
  以后要是开设新赛事，需要在上面的 small_new_homePicArr中添加新赛事的图片路径
 */

function Home(props: HomeProps) {
  const { gameList } = props;
  // 预加载的DOM
  const [homeImgArr, setHomeImgArr] = useState<string[]>([]);
  const [matchImgArr, setMatchImgArr] = useState<string[]>([]);

  // 预加载轮播图图片
  const onLoad = (images: string) => {
    setHomeImgArr(prevState => prevState.concat(images));
  };
  // 预加载赛事信息图片
  const onLoadMatch = (images: string) => {
    setMatchImgArr(prevState => prevState.concat(images));
  };
  // 实际展示的DOM
  const [carouselDOM, setCarouselDom] = useState<React.ReactNode[]>([]);
  const [gameListDOM, setGameListDom] = useState<React.ReactNode[]>([]);
  // 导航栏Menu
  const [currentMenu, setCurrentMenu] = useState('home');

  const handleChangeMenu = (e: any) => {
    setCurrentMenu(e.key);
    if (e.key === 'home') {
      router.push('/home');
    } else if (e.key === 'level') {
      router.push('/home/train');
    } else {
      router.push('/home/temp');
    }
  };

  // 这个 useEffect处理轮播图
  useEffect(() => {
    if (homeImgArr.length === new_homePicArr.length) {
      const tempDom = new_homePicArr.map((v: string) => (
        <div className={styles['carousel-item']} key={v.slice(-13, -5)}>
          <img src={v} alt="" />
        </div>
      ));
      setCarouselDom(tempDom);
    } else {
      const tempDom = new_homePicArr.map((v: string) => <Skeleton key="skeleton1" active />);
      setCarouselDom(tempDom);
    }
  }, [homeImgArr]);

  // 这个 useEffect处理赛事小图
  useEffect(() => {
    if (gameList === undefined) {
      return;
    }
    // console.log(gameList);
    // 如果加载完全了，即图片数相等，然后push进去
    if (matchImgArr.length === small_new_homePicArr.length) {
      let tempGameListDom: React.ReactNode[] = [];
      gameList.forEach((v: any, index: any) => {
        tempGameListDom.push(
          <Col key={v.id} {...adjustCol}>
            <div className={styles['game-list-block']}>
              <div className={styles['img-block']}>
                <img
                  src={small_new_homePicArr[index]}
                  onClick={() => router.push(`/home/introduction?name=${encodeURI(v.name)}`)}
                  alt=""
                />
              </div>
              <div className={styles['text-block']}>
                <div>
                  <b>赛事名称</b>:{v.name}
                </div>
                <div>
                  <b>举办时间</b>
                  <span>
                    :{v.rpstarttime.slice(0, 10).replace(/-/g, '/')}~
                    {v.rpendtime.slice(0, 10).replace(/-/g, '/')}
                  </span>
                </div>
                <div className={styles.status} style={{ marginTop: 5 }}>
                  {v.status === '报名中' ? (
                    <Tag color={'gold'}>{v.status}</Tag>
                  ) : (
                    <Tag>{v.status}</Tag>
                  )}
                  {v.status === '报名中' ? (
                    <Button
                      className={styles.button}
                      type={'primary'}
                      onClick={() => router.push(`/home/introduction?name=${encodeURI(v.name)}`)}
                    >
                      进入赛事
                    </Button>
                  ) : (
                    <Button
                      className={styles.button}
                      onClick={() => router.push(`/home/introduction?name=${encodeURI(v.name)}`)}
                    >
                      进入赛事
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Col>,
        );
      });
      setGameListDom(tempGameListDom);
      // 还没有加载完全图片时，返回加载中
    } else {
      let tempGameListDom: React.ReactNode[] = [];
      gameList.forEach((v: any, index: any) => {
        tempGameListDom.push(
          <Col key={v.id} {...adjustCol}>
            <div className={styles['game-list-block']}>
              <div className={styles['img-block']}>
                <Skeleton key="skeleton" active />
              </div>
            </div>
          </Col>,
        );
      });
      setGameListDom(tempGameListDom);
    }
  }, [gameList, gameListDOM.length, matchImgArr]);

  return (
    <div className={styles['home-page']}>
      <div>
        <Menu onClick={handleChangeMenu} selectedKeys={[currentMenu]} mode={'horizontal'}>
          <Menu.Item key={'home'}>
            <HomeOutlined />
            主页
          </Menu.Item>
          <Menu.Item key={'competition'}>
            <CrownOutlined />
            赛事
          </Menu.Item>
          <Menu.Item key={'train'}>
            <ProjectOutlined />
            培训
          </Menu.Item>
          <Menu.Item key={'level'}>
            <HeatMapOutlined />
            业余等级
          </Menu.Item>
          <Menu.Item key={'small_program'}>
            <WechatOutlined />
            小程序
          </Menu.Item>
        </Menu>
      </div>
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
          <Row justify="start" gutter={16}>
            {gameListDOM}
          </Row>
        </div>
      </div>
      <div className={styles['hidden']}>
        {new_homePicArr.map((item, i) => (
          <img src={item} onLoad={onLoad.bind(event, item)} key={i} alt="" />
        ))}
        {small_new_homePicArr.map((item, i) => (
          <img src={item} onLoad={onLoadMatch.bind(event, item)} key={i} alt="" />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = ({ gameList }: ConnectState) => {
  return {
    gameList: gameList.gameList,
  };
};

export default connect(mapStateToProps)(Home);
