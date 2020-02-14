import * as React from 'react';
// 10 单排轮滑球
// 12 轮滑球
// 14 自由式
const h12 = require('../../assets/rulesHtml/12.html');
const h13 = require('../../assets/rulesHtml/13.html');
const h14 = require('../../assets/rulesHtml/14.html');
const h21 = require('../../assets/rulesHtml/21.html');

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
  }
  return (
    <div>
      <iframe src={r} frameBorder="0" width="100%" height="300px" />
    </div>
  );
}
