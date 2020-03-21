import React, { useRef, useState, Fragment } from 'react';
import { Button, message, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import styles from '../index.less';
import { UploadOutlined } from '@ant-design/icons/lib';

interface AvatarViewProps {
  avatar: string;
  getFile: Function;
}

function AvatarView(props: AvatarViewProps) {
  const [legal, setLegal] = useState(true);
  const isLegal = useRef(true);
  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只可以上传JPG/PNG文件!');
      setLegal(false);
      isLegal.current = false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小要小于2MB!');
      setLegal(false);
      isLegal.current = false;
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = ({ file, fileList }: UploadChangeParam) => {
    props.getFile(file, isLegal);
    isLegal.current = true;
  };

  return (
    <Fragment>
      {/* <div className={styles.avatar_title}>
      验证单位信息（选填）
      </div> */}
      <div className={styles.avatar}>
        <img src={props.avatar} alt="avatar" />
      </div>
      {/*<Typography.Text code>该项用于验证单位信息（选填）</Typography.Text><br/><br/>*/}
      <Upload fileList={[]} onChange={handleChange} beforeUpload={beforeUpload}>
        <Button className={styles.uploadBtn} icon={<UploadOutlined />}>
          上传营业执照
        </Button>
      </Upload>
    </Fragment>
  );
}
export default AvatarView;
/********************************上传组件*****************************/
