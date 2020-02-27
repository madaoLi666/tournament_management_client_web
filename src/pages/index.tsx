import React from 'react';
import { Spin } from 'antd';

// export default function App() {
//   return (
//     <div className={styles['page-loading-warp']}>
//       <div className={styles['ant-spin-spinning']}>
//         <span className={styles['ant-spin-dot-spin']}>
//           <i className={styles['ant-spin-dot-item']} />
//           <i className={styles['ant-spin-dot-item']} />
//           <i className={styles['ant-spin-dot-item']} />
//           <i className={styles['ant-spin-dot-item']} />
//         </span>
//       </div>
//     </div>
//   );
// }

const PageLoading: React.FC<{
  tip?: string;
}> = ({ tip }) => (
  <div style={{ paddingTop: 100, textAlign: 'center' }}>
    <Spin size="large" tip={tip} />
  </div>
);
export default PageLoading;
