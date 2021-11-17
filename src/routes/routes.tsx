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
} from '../views';
import { slug } from '../utils/string';

interface ComponentProps {
  unauthorized?: boolean;
}

export interface Route {
  path: string;
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

const appRoutes: (Route | NavLinkRoute)[] = [
  { path: '/', component: () => <FrontPage />, exact: true, isPublic: true },
  {
    path: `/${path('register')}`,
    component: () => <Register />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('forgot_password')}`,
    component: () => <ForgotPassword />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('reset_password')}`,
    component: () => <ResetPassword />,
    exact: true,
    isPublic: true,
  },
  {
    path: `/${path('appointments')}`,
    component: props => (
      <UserAppointments unauthorized={props?.unauthorized ?? true} />
    ),
    exact: true,
    isPublic: false,
  },
  {
    path: `/${path('change_password')}`,
    component: props => (
      <ChangePassword unauthorized={props?.unauthorized ?? true} />
    ),
    exact: true,
    isPublic: false,
  },
  {
    path: `/${path('logout')}`,
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
];

export default appRoutes;
