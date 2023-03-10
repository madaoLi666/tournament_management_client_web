import React, { useEffect } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import { BasicLayout, MenuDataItem } from '@ant-design/pro-layout';
import { message } from 'antd';
import { Link, router } from 'umi';
import AvatarDropDown from '@/pages/Home/components/avatarDropDown';

const logo = 'https://react-image-1256530695.cos.ap-chengdu.myqcloud.com/img/logo2.png';

interface PersonLayoutProps {
  dispatch: Dispatch;
  children: React.ReactNode;
  collapsed?: boolean;
  getAccountLoading?: boolean;
  unitAccount?: number;
  history: any;
}

function PersonLayout(props: PersonLayoutProps) {
  const { dispatch, collapsed, getAccountLoading, unitAccount, history } = props;

  useEffect(() => {
    dispatch({
      type: 'user/getAccountData',
    });
    dispatch({
      type: 'global/person_background_drawer',
      payload: false,
    });
  }, []);

  // 如果没有补全信息进入个人中心，则先补全信息
  useEffect(() => {
    const route = history.location.pathname.split('/');
    if (
      unitAccount !== undefined &&
      unitAccount === 0 &&
      getAccountLoading !== undefined &&
      !getAccountLoading &&
      route[1] &&
      route[1] === 'user'
    ) {
      message.warning('请先补全信息');
      router.push({
        pathname: '/complete',
        query: {
          type: 0,
        },
      });
    }
  }, [unitAccount, getAccountLoading, history]);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
    menuList.map(item => {
      let localItem: {
        authority?: string[] | string;
        children?: MenuDataItem[];
        hideChildrenInMenu?: boolean;
        hideInMenu?: boolean;
        icon?: React.ReactNode;
        locale?: string | false;
        name?: string;
        key?: string;
        path?: string;
        [key: string]: any;
        parentKeys?: string[];
      };
      localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children) : [],
      };
      return localItem;
    });
    return menuList;
  };

  const signout = () => {
    // 清除TOKEN，并将store重新置空
    window.localStorage.clear();
    dispatch({
      type: 'user/clearState',
      payload: '',
    });
    dispatch({
      type: 'enroll/clearState',
      payload: '',
    });
    message.info('退出成功');
    router.push('/home');
  };

  return (
    <BasicLayout
      title="轮滑辅助系统平台"
      logo={logo}
      collapsed={collapsed}
      onCollapse={handleMenuCollapse}
      theme="light"
      menuItemRender={(menuItemProps, defaultDom) => {
        // @ts-ignore
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? <span>{route.breadcrumbName}</span> : <span>{route.breadcrumbName}</span>;
      }}
      menuDataRender={menuDataRender}
      rightContentRender={rightProps => (
        <div className={styles.rightProps}>
          <AvatarDropDown color={'person'} />
        </div>
      )}
      {...props}
    >
      {props.children}
    </BasicLayout>
  );
}

const mapStateToProps = ({ global, user, loading }: ConnectState) => {
  return {
    collapsed: global.collapsed,
    unitAccount: user.unitAccount,
    getAccountLoading: loading.effects['user/getAccountData'],
  };
};

export default connect(mapStateToProps)(PersonLayout);
