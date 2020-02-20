import React from 'react';
import styles from './index.less';

/**
 * 定义了底部的公共样式组件
 */

class FooterMsg extends React.PureComponent {
  render() {
    return (
      <footer>
        <span>
          广州青苔科技有限公司 版权所有
          <a target="_blank" href="http://beian.miit.gov.cn">
            粤ICP备20009053号-1
          </a>
        </span>
        <div className={styles.footer_block}>
          <a
            target="_blank"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44011802000333"
          >
            <img src={require('../../assets/p.png')} alt="" />
            <p>粤公网安备 44011802000333号</p>
          </a>
        </div>
      </footer>
    );
  }
}

export default FooterMsg;
