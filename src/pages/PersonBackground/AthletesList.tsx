import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import { Select, Input, Button, Modal, Layout, Table, Popconfirm, Icon, Upload, message } from 'antd';
import { ColumnProps, TableEventListeners } from 'antd/es/table';
import { UploadFile, RcFile, UploadChangeParam } from 'antd/lib/upload/interface';

// 表格接口 key 是编号
interface Athlete {
    key: string;
    name: string;
    identifyID: string;
    sex: string;
    birthday: string;
    phone: string;
    emergencyContact?: string | null;
    emergencyContactPhone?: string | null;
    // TODO 修改/删除 设置成Node
    action?: React.ReactNode;
}

export default function AthletesList() {
    // 选择框state
    const [ selectValue,setSelectValue ] = React.useState('');
    // 表格属性key state
    const [ tableKey,setTableKey ] = React.useState('');
    // 添加运动员Modal
    const [ modalVisible,setModalVisible ] = React.useState(false);
    const [ modalLoading,setModalLoading ] = React.useState(false);
    // 观察头像state

    // 选择框默认值
    let defaultvalue:any = "请选择搜索条件";
    // 修改确认
    function changeConfirm(event?: React.MouseEvent<HTMLElement, MouseEvent>) {
        console.log(tableKey);
    }
    // 删除确认
    function deleteConfirm(event?: React.MouseEvent<HTMLElement, MouseEvent>) {
        console.log(tableKey);
    }
    // 给修改与删除提供 key
    function handleRow(record:Athlete, indexnumber: number):TableEventListeners {
        return {
            onClick:(arg: React.SyntheticEvent):void => {
                setTableKey(record.key);
            }
        }
    }
    // 修改/删除Node
    let changeOrDelDOM:React.ReactNode = (
        <div>
            <Popconfirm title="确认修改吗？" onConfirm={changeConfirm} okText="确认" cancelText="取消" >
                <a href="#">修改</a>
            </Popconfirm>&nbsp;&nbsp;|
            &nbsp;&nbsp;
            <Popconfirm title="确认删除吗？" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />} onConfirm={deleteConfirm} okText="确认" cancelText="取消" >
                <a href="#">删除</a>
            </Popconfirm>
        </div>
    )
    const data: Athlete[] =[{
        key: '1',
        name: 'testName',
        identifyID: 'testID',
        sex: '男',
        birthday: '1999-09-01',
        phone: '15626466587',
        emergencyContact: 'test',
        emergencyContactPhone: '15626466587',
        action: changeOrDelDOM
    }]
    // 选择框改变触发的函数
    function handleSelectChange(value: string) {
        setSelectValue(value);
    }
    // 搜索框 搜索点击的函数
    function handleSearch(value: string, event?: any) {
        if (selectValue == '') {
            Modal.warning({
                title: '搜索错误',
                content: '请选择搜索条件'
            })
            return
        }
        if (value === null || value === "" || value === undefined) {
            Modal.warning({
                title: '搜索错误',
                content: '搜索输入内容不能为空'
            })
        }
        console.log(value);
    }
    // 添加运动员
    function addAthlete() {
        setModalVisible(true);
    }
    function handleModalOK() {
        setModalLoading(true);
        setTimeout(() => {
            setModalVisible(false);
            setModalLoading(false);
          }, 1500);
    }
    function handleModalCancel() {
        setModalVisible(false);
    }

    function getBase64(img: any,callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load',() => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file: RcFile, FileList: RcFile[]) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const [ loading,setLoading ] = React.useState(false);
    const [ imageUrl,setimageUrl ] = React.useState('');
    let handleChange = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl:any) => {
                setimageUrl(imageUrl);
                setLoading(false);
            })
        }
    }

    const uploadButton = (
        <div>
            <Icon type={loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text" >Upload</div>
        </div>
    )

    // 添加运动员DOM TODO
    let addAthleteDOM:React.ReactNode = (
        <div>
            <Upload 
                onChange={handleChange}
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
            >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width:"100%"}} /> : uploadButton}
            </Upload>
        </div>
    )
    return (
        <Layout className={styles['AthletesList-page']}>
            <Modal 
                visible={modalVisible}
                title="添加新运动员"
                onOk={handleModalOK}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="back" onClick={handleModalCancel} >返回</Button>,
                    <Button key="submit" type="primary" loading={modalLoading} onClick={handleModalOK} >提交</Button>
                ]}
            >
                {addAthleteDOM}
            </Modal>
            <Layout.Header className={styles['AthletesList-header']}>
                <Select size="large" defaultValue={defaultvalue} style={{width: 160}} onChange={handleSelectChange} >
                    <Select.Option value="name" >姓名</Select.Option>
                    <Select.Option value="id" >证件号</Select.Option>
                </Select>
                <Input.Search 
                    enterButton="搜索"
                    size="large"
                    onSearch={handleSearch}
                />
            </Layout.Header>
            <hr/>
            <Layout.Content className={styles['AthletesList-content']}>
                <Button type="primary" onClick={addAthlete}><strong>添加新运动员</strong></Button>
                <br/><br/><br/>
                <Table<Athlete> bordered={true} onRow={handleRow} dataSource={data} scroll={{x:1000}} >
                    <Table.Column<Athlete> key='key' title='编号' dataIndex='key' align="center" />
                    <Table.Column<Athlete> key='name' title='姓名' dataIndex='name' align="center" />
                    <Table.Column<Athlete> key='identifyID' title='性别' dataIndex='identifyID' align="center" />
                    <Table.Column<Athlete> key='sex' title='编号' dataIndex='sex' align="center" />
                    <Table.Column<Athlete> key='birthday' title='出生日期' dataIndex='birthday' align="center" />
                    <Table.Column<Athlete> key='phone' title='联系电话' dataIndex='phone' align="center" />
                    <Table.Column<Athlete> key='emergencyContact' title='紧急联系人' dataIndex='emergencyContact' align="center" />
                    <Table.Column<Athlete> key='emergencyContactPhone' title='紧急联系电话' dataIndex='emergencyContactPhone' align="center" />
                    <Table.Column<Athlete> key='action' title='操作' dataIndex='action' align="center" />
                </Table>
            </Layout.Content>
        </Layout>
    );
}

