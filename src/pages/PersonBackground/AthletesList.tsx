import * as React from 'react';
// @ts-ignore
import styles from './index.less';
import { Select, Input, Button, Modal, Layout, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

// 表格接口
interface Athlete {
    id: string | number;
    name: string;
    identifyID: string;
    sex: string;
    birthday: string;
    phone: string;
    emergencyContact?: string | null;
    emergencyContactPhone?: string | null;
    // TODO 修改/删除 设置成Node
    change?: React.ReactNode;
    delete?: React.ReactNode;
}

export default function AthletesList() {
    // 选择框state
    const [ selectValue,setSelectValue ] = React.useState('');
    // 弹出框state
    const [ modalValue, setModal ] = React.useState(false);
    // 选择框默认值
    let defaultvalue:any = "请选择搜索条件";
    // 表格属性
    const columns: ColumnProps<Athlete>[] = [
        {key: 'id', title: '编号', dataIndex: 'id' },
        {key: 'name', title: '姓名', dataIndex: 'name' },
        {key: 'identifyID', title: '证件号', dataIndex: 'identifyID'},
        {key: 'sex', title: '性别', dataIndex: 'sex'},
        {key: 'birthday', title: '出生日期', dataIndex: 'birthday'},
        {key: 'phone', title: '联系电话', dataIndex: 'phone'},
        {key: 'emergencyContact', title: '紧急联系人', dataIndex: 'emergencyContact'},
        {key: 'emergencyContactPhone', title: '紧急联系电话', dataIndex: 'emergencyContactPhone'},
        {key: 'action', title: '操作', dataIndex: 'action'}
    ]
    const data: Athlete[] =[{
        id: 1,
        name: 'testName',
        identifyID: 'testID',
        sex: '男',
        birthday: '1999-09-01',
        phone: '15626466587',
        emergencyContact: 'test',
        emergencyContactPhone: '15626466587'
    }]

    function handleSelectChange(value: string) {
        setSelectValue(value);
    }

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

    return (
        <Layout className={styles['AthletesList-page']}>
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
                <Button type="primary"><strong>添加新运动员</strong></Button>
                <Table<Athlete> columns={columns} dataSource={data} />
            </Layout.Content>
        </Layout>
    );
}
