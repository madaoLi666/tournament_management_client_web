import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import { Select, Input, Button, Modal, Layout, Table, Popconfirm, Icon, Upload, message } from 'antd';
import { ColumnProps, TableEventListeners, FilterDropdownProps } from 'antd/es/table';
import { UploadFile, RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import Highlighter from 'react-highlight-words';
import AddAthleteItem from './AddAthleteItem';

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
    function handleSearch(selectedKeys: string[], confirm: Function) {
        confirm();
        setsearchText(selectedKeys[0]);
        // if (selectValue == '') {
        //     Modal.warning({
        //         title: '搜索错误',
        //         content: '请选择搜索条件'
        //     })
        //     return
        // }
        // if (value === null || value === "" || value === undefined) {
        //     Modal.warning({
        //         title: '搜索错误',
        //         content: '搜索输入内容不能为空'
        //     })
        // }
        // console.log(value);
    }
    const [searchText,setsearchText] = React.useState('');
    function handleReset(clearFilters:Function) {
        clearFilters();
        setsearchText('');
    }
    // Table 内嵌搜索框
    let getColmnSearchProps:any = (dataIndex: string) => ({
        // 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}:FilterDropdownProps):React.ReactNode => (
            <div style={{padding:8}}>
                <Input
                    placeholder={`请输入搜索条件`}
                    // 输入框内容
                    value={selectedKeys[0]}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys,confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        // 自定义搜索图标
        filterIcon: (filtered: boolean) => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        // 本地模式下，确定筛选的运行函数 value不确定是否是string
        onFilter: (value: string, record: any) => 
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        render: (text:any) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape={true}
                textToHighlight={text.toString()}
            />
        )
    })


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
                <AddAthleteItem />
            </Modal>
            <Layout.Header className={styles['AthletesList-header']}>
                <Select size="large" defaultValue={defaultvalue} style={{width: 160}} onChange={handleSelectChange} >
                    <Select.Option value="name" >姓名</Select.Option>
                    <Select.Option value="id" >证件号</Select.Option>
                </Select>
                <Input.Search 
                    enterButton="搜索"
                    size="large"
                    //onSearch={handleSearch}
                />
            </Layout.Header>
            <hr/>
            <Layout.Content className={styles['AthletesList-content']}>
                <Button type="primary" onClick={addAthlete}><strong>添加新运动员</strong></Button>
                <br/><br/><br/>
                <Table<Athlete> bordered={true} onRow={handleRow} dataSource={data} scroll={{x:1000}} >
                    <Table.Column<Athlete> key='key'  title='编号' dataIndex='key' align="center" />
                    <Table.Column<Athlete> key='name' title='姓名' dataIndex='name' align="center" {...getColmnSearchProps('name')} />
                    <Table.Column<Athlete> key='sex' title='性别' dataIndex='sex' align="center" />
                    <Table.Column<Athlete> key='identifyID' title='证件号' dataIndex='identifyID' align="center" {...getColmnSearchProps('identifyID')} />
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

