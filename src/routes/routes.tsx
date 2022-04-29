import { lazy } from 'react';
import i18n from '../i18n';
import { slug } from '../utils/string';

const FrontPage = lazy(() => import('../views/FrontPage'));
const ContentPage = lazy(() => import('../views/ContentPage'));
const Register = lazy(() => import('../views/auth/Register'));
const Logout = lazy(() => import('../views/auth/Logout'));
const ChangePassword = lazy(() => import('../views/auth/ChangePassword'));
const ForgotPassword = lazy(() => import('../views/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../views/auth/ResetPassword'));
const Test = lazy(() => import('../views/Test'));
const Tests = lazy(() => import('../views/Tests'));
const UserAppointments = lazy(() => import('../views/UserAppointments'));
const Events = lazy(() => import('../views/Events'));
const TestOutcomes = lazy(() => import('../views/TestOutcomes'));
const WellBeingProfile = lazy(() => import('../views/WellBeingProfile'));
const Unauthorized = lazy(() => import('../views/Unauthorized'));
const CookieDeclaration = lazy(() => import('../views/CookieDeclaration'));

interface ComponentProps {
  unauthorized?: boolean;
}

export interface Route {
  path: string;
  title?: string;
  component: (props?: ComponentProps) => JSX.Element;
  exact: boolean;
  isPublic?: boolean;
}

export interface NavLinkRoute extends Route {
  title: string;
}

// Get route translations as it is (these are meant to show for the users, e.g. "Front page")
export const rt = (routeKey: string) => i18n.t(`route.${routeKey}`);

// Sanitize route translations
// E.g. "Front Page" becomes "front-page" (these are used in url)
export const path = (routeKey: string) => slug(rt(routeKey));

const checkAuth = (component: JSX.Element, isUnauthorized?: boolean) => {
  if (isUnauthorized === undefined || isUnauthorized) return <Unauthorized />;
  return component;
};

const appRoutes: (Route | NavLinkRoute)[] = [
  {
    path: '/',
    title: '',
    component: () => <FrontPage />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('register')}`,
    title: rt('register'),
    component: () => <Register />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('forgot_password')}`,
    title: rt('forgot_password'),
    component: () => <ForgotPassword />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('reset_password')}`,
    title: rt('reset_password'),
    component: () => <ResetPassword />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('appointments')}`,
    title: rt('appointments'),
    component: props => checkAuth(<UserAppointments />, props?.unauthorized),
    exact: true,
    isPublic: false,
  },
  {
    path: `/${path('events')}`,
    title: rt('events'),
    component: props => checkAuth(<Events />, props?.unauthorized),
    exact: true,
    isPublic: false,
  },
  {
    path: `/${path('change_password')}`,
    title: rt('change_password'),
    component: props => checkAuth(<ChangePassword />, props?.unauthorized),
    exact: true,
    isPublic: false,
  },
  {
    path: `/${path('logout')}`,
    title: rt('logout'),
    component: () => <Logout />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('content_page')}/:slug`,
    component: () => <ContentPage />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('tests')}`,
    title: rt('tests'),
    component: () => <Tests />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('tests')}/:slug`,
    component: () => <Test />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('tests')}/:slug/${path('outcome')}`,
    component: () => <TestOutcomes />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('well_being_profile')}`,
    title: rt('well_being_profile'),
    component: props => checkAuth(<WellBeingProfile />, props?.unauthorized),
    exact: true,
    isPublic: false,
  },
  {
    path: `/${path('cookies')}`,
    title: rt('cookies'),
    component: () => <CookieDeclaration />,
    exact: true,
    isPublic: true,
  },
];

export default appRoutes;
