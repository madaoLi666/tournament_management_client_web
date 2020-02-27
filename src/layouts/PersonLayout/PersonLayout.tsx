import React, { useEffect } from 'react';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'dva';
import { BasicLayout, MenuDataItem } from '@ant-design/pro-layout';
import { message, Button } from 'antd';
import { Link, router } from 'umi';

interface PersonLayoutProps {
  dispatch: Dispatch;
  children: React.ReactNode;
  collapsed?: boolean;
}

function PersonLayout(props: PersonLayoutProps) {
  const { dispatch, collapsed } = props;

  useEffect(() => {
    dispatch({
      type: 'user/getAccountData',
    });
    dispatch({
      type: 'global/person_background_drawer',
      payload: false,
    });
  }, []);

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
        [p: string]: any;
        hideInMenu?: boolean;
        path?: string;
        children: MenuDataItem[];
        authority?: string[] | string;
        icon?: string;
        name?: string;
        parentKeys?: string[];
        hideChildrenInMenu?: boolean;
        locale?: string;
        key?: string;
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
      logo={require('@/assets/logo.png')}
      collapsed={collapsed}
      onCollapse={handleMenuCollapse}
      theme="light"
      menuItemRender={(menuItemProps, defaultDom) => {
        // @ts-ignore
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => {
        return [
          {
            path: '/',
            breadcrumbName: '运动员列表',
          },
          ...routers,
        ];
      }}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      menuDataRender={menuDataRender}
      rightContentRender={rightProps => (
        <div style={{ display: 'inline', float: 'right' }}>
          <Button type="link" onClick={signout}>
            退出账号
          </Button>
          <Button
            type="link"
            onClick={() => {
              router.push('/home');
            }}
          >
            返回主页
          </Button>
        </div>
      )}
      {...props}
    >
      {props.children}
    </BasicLayout>
  );
}

const mapStateToProps = ({ global }: ConnectState) => {
  return { collapsed: global.collapsed, drawer_visible: global.drawer_visible };
};

export default connect(mapStateToProps)(PersonLayout);
