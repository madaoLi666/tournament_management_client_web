import React,{ useEffect, useState } from 'react';
import { Popover, PageHeader, Input, Button, Modal, Layout, Table, Popconfirm, Icon, message } from 'antd';
import { ColumnFilterItem, TableEventListeners, FilterDropdownProps, PaginationConfig, SorterResult } from 'antd/es/table';
import Highlighter from 'react-highlight-words';
import AddAthleteForm,{ formFields } from './AddAthleteItem';
import { connect } from 'dva';
import { UnitData, AthleteData } from '@/models/user';
import { addplayer, updatePlayer } from '@/services/athlete';
// @ts-ignore
import styles from './index.less';

const { confirm } = Modal;

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

interface athletesProps {
    id?: string
    unitAccount?: number
    athletes?: AthleteData[]
    unitData?: UnitData[]
}

function AthletesList(props:athletesProps) {
    // @ts-ignore
    const { dispatch, unitAccount, unitData, id, athletes } = props;
    let isDelete: boolean = false;
    let isChange: boolean = false;

    // 修改/删除Node
    let changeOrDelDOM = (text: any, record: Athlete, index: number) => {
        let myEvent:React.MouseEvent<HTMLAnchorElement, MouseEvent>;
        return (
            <div>
                <a href="#" onClick={changeConfirm} >修改</a>
                &nbsp;&nbsp;|
                &nbsp;&nbsp;
                <a href="#"  onClick={deleteConfirm.bind(myEvent,index)} >删除</a>
            </div>
        )
    }
    // 表格data
    let data: Athlete[] = [];

    // 如果是个人账号
    if (unitAccount === 1) {
        athletes.forEach((item,index) => {
            data.push({
                key: (index+1).toString(),
                name: item.name,
                identifyID: item.idcard,
                sex: item.sex,
                birthday: item.birthday,
                phone: item.phonenumber,
                emergencyContact: item.emergencycontactpeople,
                emergencyContactPhone: item.emergencycontactpeoplephone,
            })
        })
    // 是单位账号
    }else if (unitData.length !== 0) {
        unitData[0].unitathlete.forEach((item,index) => {
            data.push({
                key: (index+1).toString(),
                name: item.athlete.name,
                identifyID: item.athlete.idcard,
                sex: item.athlete.sex,
                birthday: item.athlete.birthday.substr(0,10),
                phone: item.athlete.phonenumber,
                emergencyContact: item.athlete.emergencycontactpeople,
                emergencyContactPhone: item.athlete.emergencycontactpeoplephone,
            })
        })
    }
    // 添加运动员Modal
    const [ modalVisible,setModalVisible ] = useState(false);
    const [searchText,setsearchText] = useState('');
    // 表格属性key
    const [ key ,setkey] = useState('');
    // 修改确认
    function changeConfirm() {
        // 根据key去store里面找相应的数据
        isChange = true;
        setModalVisible(true);
    }
    // 删除确认
    function deleteConfirm(index: number,event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        isDelete = true;
        confirm({
            title:'确认删除吗?',
            onOk() {
                dispatch({
                    type: 'user/deleteAthlete',
                    payload: index
                })
            },
            onCancel() {},
            okText:'确认',
            cancelText:'取消'
        })
    }
    // 给修改与删除提供 key
    function handleRow(record:Athlete, indexnumber: number):TableEventListeners {
        return {
            onClick:(arg: React.SyntheticEvent):void => {
                // 如果点击的是删除按钮
                if(!isDelete) {
                    isDelete = false;
                }
                // 点击的是修改按钮，设置这些是因为table的onRow函数，点击表格行也会触发的
                if(isChange) {
                    setkey(record.key);
                    isChange = false;
                    return;
                }
            },
        }
    }
    // 搜索框 搜索点击的函数
    function handleSearch(selectedKeys: string[], confirm: Function) {
        confirm();
        setsearchText(selectedKeys[0]);
    }
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
            <Popover content={filtered ? "点击重置" : '点击搜索'}>
                <Icon type="search" style={{ color: filtered ? '#FF0000' : '#1890ff' }} />
            </Popover>
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
    // onChange 表格筛选
    function onChange(pagination: PaginationConfig, filters: Record<"sex",string[]>, sorter: SorterResult<any>) {
        console.log('params',pagination,filters,sorter);
    }

    // 添加运动员
    function addAthlete() {
        setModalVisible(true);
    }
    // 点击右上角退出Modal
    const [ judgeReset,setJudgeReset ] = useState(false);
    function handleModalCancel() {
        setModalVisible(false);
        setJudgeReset(true);
        setTimeout(() => {
            setJudgeReset(false);
        }, 50);

        // 清除props，防止下次打开Modal对表单造成影响，会有之前的数据
        if ( key !== '' ) {
            setkey('');
        }
    }
    let AddbuttonNode:React.ReactNode = (
        unitAccount === 1 ? null : <Button style={{float:"right"}} type="primary" icon="plus" onClick={addAthlete}><strong>添加新运动员</strong></Button>
    )
    let sexFilter:ColumnFilterItem[] = [
        {
            text:'男',
            value:'男'
        },{
            text:'女',
            value:'女'
        }
    ]

    function closemodal() {
        setModalVisible(false);
    }

    // 表单提交方法
    let handleSubmit = (values: formFields, todo: string) => {
        let citys:string = '';
        let myAddress:string = '';
        // TODO image暂时传null，还没完成该功能
        let myImage:File = null;

        // 如果用户填写了地址，那么将该地址转换成字符串
        if (values.residence) {
            citys = values.residence.city.join("");
            myAddress = values.residence.address
        }else {
            myAddress = null;
            citys = null;
        }

        // 传过去的data
        let data = {
            idcard: values.identifyID,
            name: values.name,
            idcardtype: values.idCardType,
            sex: values.sex,
            birthday: values.birthday,
            phonenumber: values.phone,
            email: values.email,
            province: citys,
            address: myAddress,
            emergencycontactpeople: values.emergencyContact,
            emergencycontactpeoplephone: values.emergencyContactPhone,
            face: myImage,
            unitdata: unitData[0] === undefined ? 0 : unitData[0].id
        }

        let res: Promise<any>;

        if (todo === 'register') {
            res = addplayer(data)
        } else if (todo === 'update') {
            res = updatePlayer(data);
        }

        res.then((resp) => {
            if (resp.error === '' || resp.error === null) {
                message.success(todo === 'register' ? '添加成功' : '修改成功');
                closemodal();
                // 重置表单，先重置再设置成不重置
                setJudgeReset(true);
                setJudgeReset(false);
                // 清除props，防止下次打开Modal对表单造成影响，会有之前的数据
                if ( key !== '' ) {
                    setkey('');
                }
            }else if (Object.prototype.toString.call(resp.error) === '[object String]') {
                message.error(resp.error);
            }else if (Object.prototype.toString.call(resp.error) === '[object Object]') {
                message.warning('请检查是否输入了空的字符');
            }else {
                message.warning('请填入所有的表单项');
            }
        })

    }
    // let test:object = {address: ["该字段不能为空。"], emergencycontactpeople: ["该字段不能为空。"]};

    // 当judgeReset改变时，重新渲染一次
    useEffect(() => {
        dispatch({
            type:'user/getAccountData'
        })
    },[judgeReset]);

    return (
        <Layout className={styles['AthletesList-page']}>
            <Layout.Content className={styles['AthletesList-content']}>
                
                <PageHeader style={{fontSize:16}} title="运动员列表" extra={AddbuttonNode} />
                <br/>
                <Table<Athlete> bordered={true} onChange={onChange} onRow={handleRow} dataSource={data} scroll={{x:1010}} >
                    <Table.Column<Athlete> key='key'  title='编号' dataIndex='key' align="center" />
                    <Table.Column<Athlete> key='name' title='姓名' dataIndex='name' align="center" {...getColmnSearchProps('name')} />
                    <Table.Column<Athlete> 
                        key='sex'
                        filters={sexFilter}
                        onFilter={(value:any,record:Athlete) => record.sex.indexOf(value) === 0}
                        title='性别'
                        dataIndex='sex'
                        align="center" 
                    />
                    <Table.Column<Athlete> key='identifyID' title='证件号' dataIndex='identifyID' align="center" {...getColmnSearchProps('identifyID')} />
                    <Table.Column<Athlete> key='birthday' title='出生日期' dataIndex='birthday' align="center" />
                    <Table.Column<Athlete> key='phone' title='联系电话' dataIndex='phone' align="center" />
                    <Table.Column<Athlete> key='emergencyContact' title='紧急联系人' dataIndex='emergencyContact' align="center" />
                    <Table.Column<Athlete> key='emergencyContactPhone' title='紧急联系电话' dataIndex='emergencyContactPhone' align="center" />
                    <Table.Column<Athlete> key='action' title='操作' dataIndex='action' align="center" render={changeOrDelDOM} />
                </Table>
            </Layout.Content>
            <Modal
                    visible={modalVisible}
                    title="添加新运动员"
                    onCancel={handleModalCancel}
                    style={{top:0}}
                    maskClosable={false}
                    width={960}
                    footer={null}
            >
                <AddAthleteForm resetField={judgeReset} tablekey={key} submit={handleSubmit} />
            </Modal>
        </Layout>
    );
}

const mapStateToProps = ({user}:any) => {
    let props:athletesProps = {
        id: user.id,
        unitAccount: user.unitAccount,
        athletes: user.athleteData,
        unitData: user.unitData
    }
    return props;
}

export default connect(mapStateToProps)(AthletesList);
