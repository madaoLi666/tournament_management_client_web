import React,{Component} from 'react';
import router from 'umi/router';
import { connect } from 'dva';

class Authorized extends Component<any,any>{
  constructor(props:any){super(props);}

  componentDidMount(): void {
    // @ts-ignore
    const { dispatch ,storeToken } = this;

    const localToken = localStorage.getItem('TOKEN');
    console.log(localToken);
    // 检查本地是否存在token
    if(localToken === undefined || localToken === null){
      // 否
      router.push('./login');
    }


    // 检查store中是否存在token
    if(storeToken === ''){
      // 否 设置token
      dispatch({
        type: 'user/setStoreByLocal',
        payload: {token: localToken}
      })
    }else{}
      // 待定
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
