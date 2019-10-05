import React,{useEffect, useState} from 'react';
import { Layout, PageHeader, Descriptions, Table, Comment, Button } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'dva';
import { Dispatch } from 'redux';
// @ts-ignore
import styles from './index.less';
import router from 'umi/router';

const { Header, Content, Footer } = Layout;

interface showEnrollProps {
    current_match_id?: number | undefined;
    unit_info?: any;
    game_list?: Array<any>;
    dispatch: Dispatch;
    contestant?: any;
    athleteList?: any;
    teamList?: Array<any>;
}
interface unitInfo {
    unit_name?: string
    unit_leader?: string
    leader_phone?: string | number
    leader_email?: string
    coach1?: string
    coach2?: string
    coach1_phone?: string
    coach2_phone?: string
}
interface personProject {
    name?: string
    id_card?: string
    sex?: string
    birthday?: string
    affiliated_group?: string
    enroll_group?: string
    enroll_project?: string
    // 两个是表格用的
    operation?: React.ReactNode
    key?: number
}
interface teamProject {
    key?: string
    project_name?: string
    enroll_group?: string
    team_name?: string
    team_member?: string
    man?: number
    woman?: number
}
// 个人数组处理
function getArray(your_array: Array<any>): string{
    if(your_array === undefined || your_array.length === 0){return ''};
    let return_string = '';
    for(let i = 0;i < your_array.length; i++) {
        return_string += (your_array[i].name + '  ');
    }
    return return_string;
}
// 团队数组处理
function getArray1(your_array: Array<any>): string{
    if(your_array === undefined || your_array.length === 0){return ''};
    let return_string = '';
    for(let i = 0;i < your_array.length; i++) {
        return_string += (your_array[i].athlete.name + '  ');
    }
    return return_string;
}
function getManNumber(all_member: Array<any>): number{
    if(all_member === undefined || all_member.length === 0 ){return 0};
    all_member = all_member.filter((v:any) => (v.athlete.sex === '男'));
    return all_member.length;
}

function ShowEnroll(props:showEnrollProps) {
    const [game_name,setGame_name] = useState('');
    useEffect(() => {
        if(props.game_list.length !== 0){
            for(let i = 0; i < props.game_list.length; i++){
                if(props.current_match_id === props.game_list[i].id){
                    setGame_name(props.game_list[i].name);
                }
            }
        }
    },[props.current_match_id,props.game_list]);
    
    // 获取信息 调用 checkisenroll接口
    useEffect(() => {
        if(props.unit_info.id === undefined){return;};
        props.dispatch({
            type:'enroll/checkIsEnrollAndGetAthleteLIST',
            payload:{
                matchId: props.current_match_id,
                unitId: props.unit_info.id
            }
        })
    },[props.unit_info,props.current_match_id]);
    
    const [unit_info, setUnit_info] = useState<unitInfo>({
        unit_name:'',unit_leader:'',leader_phone:'',leader_email:'',
        coach1:'',coach1_phone:'',coach2:'',coach2_phone:''
    });
    useEffect(() => {
        const { contestant } = props;
        if(contestant.id === undefined){return;};
        setUnit_info({
            unit_name: contestant.name,
            unit_leader: contestant.leader,
            leader_phone: contestant.leaderphonenumber,
            leader_email: contestant.email,
            coach1: contestant.coachone,
            coach2: contestant.coachtwo,
            coach1_phone: contestant.coachonephonenumber,
            coach2_phone: contestant.coachtwophonenumber,
        })
    },[props.contestant])
    
    const [athlete_list, setAthlete_list] = useState<personProject[]>();
    useEffect(() => {
        const { athleteList } = props;
        if(athleteList === undefined || athleteList.length === 0){return;};
        // 筛选出选中的先
        let person_athlete_list: Array<any> = athleteList.filter((v:any) => (v.active == 1));
        person_athlete_list = person_athlete_list.filter((v:any) => (v.project.personaldata.length + v.project.upgrouppersonaldata.length !== 0));
        let temp_list = new Array<personProject>();
        for(let i = 0; i < person_athlete_list.length; i++) {
            let temp_athlete: personProject = {
                name: person_athlete_list[i].athlete.name,
                id_card: person_athlete_list[i].athlete.idcard,
                sex: person_athlete_list[i].athlete.sex,
                birthday: person_athlete_list[i].athlete.birthday.substr(0,10),
                enroll_group: person_athlete_list[i].groupage,
                enroll_project: getArray(person_athlete_list[i].project.personaldata) + getArray(person_athlete_list[i].project.upgrouppersonaldata),
                key: person_athlete_list[i].athlete.id,
            }
            temp_list.push(temp_athlete);
        }
        setAthlete_list(temp_list);
    },[props.athleteList]);

    const [team_list, setTeam_list] = useState<teamProject[]>();
    useEffect(() => {
        const { teamList } = props;
        if(teamList.length === 0){setTeam_list([]);return;};
        let temp_list = new Array<teamProject>();
        for(let i = 0;i < teamList.length; i++) {
            let project_group_names: string[];
            let man_member = getManNumber(teamList[i].member);
            project_group_names = teamList[i].itemGroupSexName.split('-',3);
            let temp_team: teamProject = {
                project_name: project_group_names[0],
                enroll_group: project_group_names[1],
                team_name: teamList[i].teamName,
                team_member: getArray1(teamList[i].member),
                key: i.toString(),
                man: man_member,
                woman: teamList[i].member.length - man_member
            }
            temp_list.push(temp_team);
        }
        setTeam_list(temp_list);
    },[props.teamList]);

    // 页头主体
    const renderContent = (column = 2) => (
        <div >
            <Descriptions size="middle" column={column}>
            <Descriptions.Item label="领队">{unit_info.unit_leader}</Descriptions.Item>
            <Descriptions.Item label="领队电话">
                {unit_info.leader_phone}
            </Descriptions.Item>
            <Descriptions.Item label="领队邮箱">{unit_info.leader_email}</Descriptions.Item>
            </Descriptions>
            {unit_info.coach1 === "" ? null : 
                <Descriptions size="middle" column={2} >
                <Descriptions.Item label="教练">{unit_info.coach1}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{unit_info.coach1_phone}</Descriptions.Item>
                </Descriptions>
            }
            {unit_info.coach2 === "" ? null : 
                <Descriptions size="middle" column={2} >
                <Descriptions.Item label="教练">{unit_info.coach2}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{unit_info.coach2_phone}</Descriptions.Item>
                </Descriptions>
            }
        </div>
      );
    const PageContent = ({children}:any) => {
        return (
            <div className="content">
                <div className="main">{children}</div>
            </div>
        )
    }
    // 表格Columns
    const personColumns: ColumnProps<personProject>[] = [
        {key: 'name', dataIndex: 'name', title: '姓名',align:'center'},
        {key: 'id_card', dataIndex: 'id_card', title:'证件号',align:'center'},
        {key: 'sex', dataIndex: 'sex', title: '性别',align:'center'},
        {key: 'birthday', dataIndex: 'birthday', title:'出生日期',align:'center'},
        {key: 'enroll_group' , dataIndex: 'enroll_group', title: '填报组别',align:'center'},
        {key: 'enroll_project', dataIndex: 'enroll_project', title:'填报项目',align:'center'},
        // {key: 'operation', title: '操作',align:'center'}
    ]
    const teamColumns: ColumnProps<teamProject>[] = [
        {key: 'project_name', dataIndex: 'project_name', title: '参赛项目',align:'center'},
        {key: 'enroll_group', dataIndex: 'enroll_group', title: '填报组别',align:'center'},
        {key: 'team_name', dataIndex: 'team_name', title: '参赛队伍名称（队名）',align:'center'},
        {key: 'team_member', dataIndex: 'team_member', title: '队员名单',align:'center'},
        {key: 'man', dataIndex: 'man', title: '男',align:'center'},
        {key: 'woman', dataIndex: 'woman', title: '女',align:'center'}
    ]

    return(

        <Layout>
            <Header className={styles['show-enroll-header']} >
                <strong style={{fontSize:20}}>报名赛事：{game_name}</strong>
            </Header>
            <hr />
            <Comment author={<a style={{fontSize:12,color:'#f5222d'}}>尊敬的领队您好：</a>} 
                content={
                    <p style={{color:'#f5222d'}} >
                        本赛事组委会已收到贵单位提交的报名信息，请认真确认下列全部信息。
                        确认无误后，请点击提交本《确认书》至赛事组委会，同时以此表明贵单位已清楚明白对本场赛事所有信息的责任和权利。
                    </p>
                }
            />
            <Content className={styles['show-enroll-content']} >
                <div style={{backgroundColor:'#ffffff'}} >
                    <PageHeader title={'单位：'+unit_info.unit_name} onBack={() => {router.goBack()}}>
                        <PageContent >{renderContent()}</PageContent>
                    </PageHeader>
                </div>
                <br />
                <div className={styles['show-person']} >
                    <p><strong>个人项目报名</strong></p>
                    <Table bordered={true} scroll={{x: 800}} columns={personColumns} dataSource={athlete_list} rowKey={(record:any) => record.key} />
                </div>
                <br />
                <div className={styles['show-team']} >
                    <p><strong>团体项目报名</strong></p>
                    <Table bordered={true} scroll={{x: 850}} columns={teamColumns} dataSource={team_list} rowKey={(record:any) => record.key}  />
                </div>
            </Content>
            <Footer><Button type="primary" style={{display:'block',margin:'0 auto',width:'100%'}} onClick={() => router.push('/enroll/success')} >提交本《确认书》</Button></Footer>
        </Layout>
    );

}

let mapStateToProps = (state:any) => {
    const { enroll } = state;
    const { gameList } = state;
    return {
        current_match_id: enroll.currentMatchId,
        unit_info: enroll.unitInfo,
        game_list: gameList.gameList,
        contestant: enroll.unit.contestantUnitData,
        athleteList: enroll.unit.athleteList,
        teamList: enroll.unit.teamEnrollList
    }
}

export default connect (mapStateToProps)(ShowEnroll);
