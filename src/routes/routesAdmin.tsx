import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import { NavLinkRoute, path, Route, rt } from './routes';

const AdminLogin = lazy(() => import('../views/admin/AdminLogin'));
const AdminFrontPage = lazy(() => import('../views/admin/AdminFrontPage'));

const adminPath = (route: string) => `/${path('admin')}/${path(route)}`;
const adminTitle = (route: string) => `${rt('admin')} / ${rt(route)}`;

const checkAuth = (component: JSX.Element, isUnauthorized?: boolean) => {
  if (isUnauthorized === undefined || isUnauthorized) {
    return <Redirect to={adminPath('login')} />;
  }
  return component;
};

const adminRoutes: (Route | NavLinkRoute)[] = [
  {
    path: `/${path('admin')}`,
    title: rt('admin'),
    component: props => checkAuth(<AdminFrontPage />, props?.unauthorized),
    exact: true,
    isPublic: false,
  },
  {
    path: adminPath('login'),
    title: adminTitle('login'),
    component: () => <AdminLogin />,
    exact: true,
    isPublic: true,
  },
];

export default adminRoutes;
