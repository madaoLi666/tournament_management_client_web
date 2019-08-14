import { IRoute } from 'umi-types';
import uRoutes, { MAIN_PATH } from '@/config/router';



export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

export function patchRoutes(routes: IRoute) {
  routes.forEach((v:IRoute) => {
    if(v.path === MAIN_PATH) v.routes = uRoutes;
  });
}
