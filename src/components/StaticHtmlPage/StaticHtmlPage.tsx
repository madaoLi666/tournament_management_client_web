import * as React from 'react';
const h12 = require('../../assets/rulesHtml/12.html');
const h13 = require('../../assets/rulesHtml/13.html');
const h14 = require('../../assets/rulesHtml/14.html');

interface Props {index:number|string}

export default function StaticHtmlPage(props: Props):React.ReactNode {
  const { index } = props;
  let r = '';
  if(index === 12){
   r = h12;
  }else if(index === 13) {
    r = h13;
  }else if(index === 14) {
    r = h14;
  }
    return (
      <div>
        <iframe src={r} frameBorder="0" width='100%' height='300px'/>
      </div>
  )
}
