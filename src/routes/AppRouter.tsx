import React, { FC, Suspense } from 'react';
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
import PageWrapper from './PageWrapper';
import adminRoutes from './routesAdmin';
import { useAdminStore } from '../store/admin/adminStoreContext';

interface Props {
  routes?: Route[];
}

const AppRouter: FC<Props> = observer(({ routes = appRoutes }) => {
  const {
    auth: { isLoggedIn },
  } = useStore();

  const {
    auth: { isLoggedIn: isAdminLoggedIn },
  } = useAdminStore();

  const publicRoutes = routes.filter(({ isPublic }) => isPublic);
  const authRoutes = routes.filter(({ isPublic }) => !isPublic);

  return (
    <Router>
      <Suspense fallback={<div>...</div>}>
        <ScrollToTop />
        <Switch>
          {publicRoutes.map(route => (
            <RouterRoute
              key={route.path}
              path={route.path}
              component={() => (
                <PageWrapper title={route.title}>
                  {route.component()}
                </PageWrapper>
              )}
              exact={route.exact}
            />
          ))}

          {authRoutes.map(route => (
            <RouterRoute
              key={route.path}
              path={route.path}
              component={() => (
                <PageWrapper title={route.title}>
                  {route.component({ unauthorized: !isLoggedIn })}
                </PageWrapper>
              )}
              exact={route.exact}
            />
          ))}

          {adminRoutes.map(route => (
            <RouterRoute
              key={route.path}
              path={route.path}
              component={() => (
                <PageWrapper title={route.title}>
                  {route.component({ unauthorized: !isAdminLoggedIn })}
                </PageWrapper>
              )}
              exact={route.exact}
            />
          ))}
          <NotFound404 />
        </Switch>
      </Suspense>
    </Router>
  );
});

export default AppRouter;
