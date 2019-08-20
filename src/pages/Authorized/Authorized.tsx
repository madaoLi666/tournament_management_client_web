import React,{Component} from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { checkAccountState } from '@/services/login';

class Authorized extends Component<any,any>{
  constructor(props:any){super(props);}

  async componentWillMount(): Promise<void> {
    // @ts-ignore
    const { dispatch ,storeToken } = this.props;
    const localToken = await window.localStorage.getItem('TOKEN');

    // 检查本地是否存在token
    //不存在token
    if(localToken === undefined || localToken === null) {
      await router.push('./login');
    }else{
      // 检查store中是否存在token
      if(storeToken === ''){dispatch({ type: 'user/setStoreByLocal', payload: {token: localToken}})}
      // 需放在token判断后，不然会阻塞token
      let res = await checkAccountState().then(res => {return res.data});
      // 判断state状态觉得跳转
      switch (res) {
        case '0':
          // 以完成所以的注册操作，不做任何事
          break;
        case '3':
          alert('未完成运动员信息补全操作');
          router.push('/login/infoSupplement');
          break;
        case '4':
          alert('此账号未选择身份角色');
          router.push('/login/setRole');
          break;
      }
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    )
  }
}

export default connect(({user}:any) => {
  return{ storeToken:user.token };
})(Authorized)
