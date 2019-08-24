import * as React from 'react';
import { Upload, Modal, message } from 'antd';
import {  UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import { FaPlus } from 'react-icons/fa';

function getBase64(file:any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component<{getFile:Function, value?:string,onChange?: any},any> {
   constructor(props:any) {
       super(props);
       this.state = {
        previewVisible: false,
        previewImage: '',
        fileList: [
        ],
      };
   }

   componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    if(prevProps.value !== this.props.value) {
      if(this.props.value !== '' && this.props.value !== undefined && this.props.value !== null) {
        this.setState({
          fileList:[
            {
              uid:'-1',
              url:this.props.value
            }
          ],
        })
     }else {
      this.setState({
        fileList:[]
      })
     }
    }
   }

   public beforeUpload(file: RcFile, FileList: RcFile[]) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只可以上传JPG/PNG文件!请点击图片删除');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('头像必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
   }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ file,fileList }:UploadChangeParam) => {
    this.setState({ fileList })
    this.props.getFile(file);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <FaPlus type="plus" />
        <div className="ant-upload-text">
          上传头像<br/>(可选项)
        </div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}


export default PicturesWall;
