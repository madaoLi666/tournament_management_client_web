import React, { useEffect, useState } from 'react';
import { Form, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';

interface UploadFormProps {
  name: string;
  label: string;
  guaranteePic: string | null;
  required: boolean;
}

/*
  name跟label是传入的form值, guaranteePic是这个表单是否有值，如果之前已经上传过了并提交了，这里应该是一个图片链接
  否则是一个null
  !注意，name不能跟初始值的name相同,比如初始值中guaranteePic是这个图片的链接，那么name不能是guaranteePic

  表单上传组件，因为file类型之后要转换为string类型，
  所以没办法直接在这个组件中做判断，因此要在使用的form的提交成功事件中进行表单验证,
  1.默认值为undefined
  2.上传文件之后是一个数组，数组第一个元素就是file类型，再从里面提取
  3.如果这时候再删除文件，默认值就会变成空数组
  4.判断时应加上 && guaranteePic,即如果已经生成过图片，那么可跳过之类
 */

export default function UploadForm(props: UploadFormProps) {
  const { name, label, guaranteePic, required } = props;

  const [needUpload, setNeedUpload] = useState(false);

  const normFile = (e: { file: any; fileList: any }) => {
    // 限制上传文件大小
    if (e.file && e.file.originFileObj.size / 1024 / 1024 > 3) {
      message.error('文件大小超过3M，请重新上传');
      e.fileList.pop();
      return;
    }
    if (Array.isArray(e)) {
      return e;
    }
    // 限制文件上传个数
    if (e.fileList.length > 1) {
      message.error('仅能上传一个文件');
      e.fileList.pop();
      return;
    }
    setNeedUpload(true);
    return e && e.fileList;
  };

  useEffect(() => {
    if (guaranteePic) {
      setNeedUpload(false);
    } else {
      setNeedUpload(true);
    }
  }, [guaranteePic]);

  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      required={required}
    >
      <Upload accept={'image/*'} name="file" action="" listType="picture">
        {needUpload ? (
          <Button>
            <UploadOutlined />
            点击上传
          </Button>
        ) : (
          // @ts-ignore
          <img className={styles.img} src={guaranteePic} alt="" />
        )}
      </Upload>
    </Form.Item>
  );
}
