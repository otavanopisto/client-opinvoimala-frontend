import i18n from '../i18n';
import {
  FrontPage,
  ContentPage,
  Register,
  Logout,
  ChangePassword,
  ForgotPassword,
  ResetPassword,
  Test,
  Tests,
  UserAppointments,
  TestOutcomes,
  WellBeingProfile,
} from '../views';
import Unauthorized from '../views/Unauthorized';
import { slug } from '../utils/string';

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
    title: rt('content_page'),
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
    title: rt('tests'),
    component: () => <Test />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('tests')}/:slug/${path('outcome')}`,
    title: rt('outcome'),
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
];

export default appRoutes;
