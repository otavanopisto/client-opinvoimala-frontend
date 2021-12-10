import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Route as RouterRoute,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import appRoutes, { Route } from './routes';
import ScrollToTop from './ScrollToTop';
import { useStore } from '../store/storeContext';
import NotFound404 from '../views/404';
import RouteTracker from '../components/AnalyticsRouteTracker';

interface Props {
  routes?: Route[];
}

const AppRouter: FC<Props> = observer(({ routes = appRoutes }) => {
  const {
    auth: { isLoggedIn },
  } = useStore();

  const publicRoutes = routes.filter(({ isPublic }) => isPublic);
  const authRoutes = routes.filter(({ isPublic }) => !isPublic);

  return (
    <Router>
      <ScrollToTop />
      <RouteTracker />
      <Switch>
        {publicRoutes.map(route => (
          <RouterRoute
            key={route.path}
            path={route.path}
            component={() => route.component()}
            exact={route.exact}
          />
        ))}
        {authRoutes.map(route => (
          <RouterRoute
            key={route.path}
            path={route.path}
            component={() => route.component({ unauthorized: !isLoggedIn })}
            exact={route.exact}
          />
        ))}
        <NotFound404 />
      </Switch>
    </Router>
  );
});

export default AppRouter;
