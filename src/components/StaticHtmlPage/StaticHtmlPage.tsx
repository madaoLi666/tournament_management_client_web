import * as React from 'react';
// 10 单排轮滑球
// 12 轮滑球
// 14 自由式
// const h12 = require('../../assets/rulesHtml/12.html');
// const h13 = require('../../assets/rulesHtml/13.html');
// const h14 = require('../../assets/rulesHtml/14.html');
// const h24 = require('../../assets/24.html');

const h12 = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/html/12.html';
const h13 = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/html/13.html';
const h14 = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/html/14.html';
const h21 = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/html/21.html';
const h22 = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/html/22.html';
const h23 = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/html/23.html';
const h24 = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/html/24.html';

interface Props {
  index: any;
}

export default function StaticHtmlPage(props: Props) {
  const { index } = props;
  let r = '';
  if (index === 12) {
    r = h12;
  } else if (index === 13) {
    r = h13;
  } else if (index === 14) {
    r = h14;
  } else if (index === 21) {
    r = h21;
  } else if (index === 22) {
    r = h22;
  } else if (index === 23) {
    r = h23;
  } else if (index === 24) {
    r = h24;
  }
  return (
    <div>
      <iframe src={r} frameBorder="0" width="100%" height="300px" />
    </div>
  );
}
