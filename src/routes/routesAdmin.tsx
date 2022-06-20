import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import { NavLinkRoute, path, Route, rt } from './routes';

const AdminLogin = lazy(() => import('../views/admin/AdminLogin'));
const AdminFrontPage = lazy(() => import('../views/admin/AdminFrontPage'));
const AdminAppointments = lazy(
  () => import('../views/admin/AdminAppointments')
);
const AdminAppointmentSpecialists = lazy(
  () => import('../views/admin/AdminAppointmentSpecialists')
);

export const adminPath = (route?: string) => {
  const basePath = `/${path('admin.root')}`;
  if (!route?.length) return basePath;
  return `${basePath}/${path(route)}`;
};
const adminTitle = (route: string) => `${rt('admin.root')} / ${rt(route)}`;

const checkAuth = (component: JSX.Element, isUnauthorized?: boolean) => {
  if (isUnauthorized === undefined || isUnauthorized) {
    return <Redirect to={adminPath('login')} />;
  }
  return component;
};

const adminRoutes: (Route | NavLinkRoute)[] = [
  {
    path: adminPath(),
    title: rt('admin.root'),
    component: props => checkAuth(<AdminFrontPage />, props?.unauthorized),
    exact: true,
    isPublic: false,
  },
  {
    path: adminPath('admin.appointments'),
    title: adminTitle('admin.appointments'),
    component: props => checkAuth(<AdminAppointments />, props?.unauthorized),
    exact: true,
    isPublic: false,
  },
  {
    path: adminPath('admin.appointment_specialists'),
    title: adminTitle('admin.appointment_specialists'),
    component: props =>
      checkAuth(<AdminAppointmentSpecialists />, props?.unauthorized),
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
