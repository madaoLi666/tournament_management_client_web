import React,{Component} from 'react';
import router from 'umi/router';
import { connect } from 'dva';

class Authorized extends Component<any,any>{
  constructor(props:any){super(props);}

  async componentWillMount(): Promise<void> {
    // @ts-ignore
    const { dispatch ,storeToken } = this.props;
    const localToken = await window.localStorage.getItem('TOKEN');

    // 检查本地是否存在token
    //不存在token
    if(localToken === undefined || localToken === null) {
      await router.push('/login');
    }else{
      // 检查store中是否存在token
      if(storeToken === ''){dispatch({ type: 'user/setStoreByLocal', payload: {token: localToken}})}
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
