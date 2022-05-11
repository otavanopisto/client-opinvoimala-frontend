import React, { useEffect } from 'react';
import './i18n';
import { useStore } from './store/storeContext';
import { observer } from 'mobx-react-lite';
import { Dimmer, Loader } from 'semantic-ui-react';
import { GlobalStyle, theme, ThemeProvider } from './theme';
import AppRouter from './routes/AppRouter';
import Cookiebot from './components/Cookiebot';
import Analytics from './components/Analytics';
import Chat from './components/Chat';
import MaintenancePage from './views/auth/MaintenancePage';

const App: React.FC = observer(() => {
  const {
    auth: { state: authState, user, isLoggedIn, getMe },
    settings: { state: settingsState, fetchSettings, settings, maintenance },
    navigation: { state: navigationState },
    appointments: { appointmentState },
  } = useStore();

  const isFetching = (...states: string[]) => {
    const fetchingStates = states.filter(state =>
      ['NOT_FETCHED', 'FETCHING', 'PROCESSING'].includes(state)
    );
    return !!fetchingStates.length;
  };

  const isBusy = (...states: string[]) => {
    const fetchingStates = states.filter(state =>
      ['CANCELLING'].includes(state)
    );
    return !!fetchingStates.length;
  };

  const appIsLoading =
    isFetching(settingsState, navigationState, authState) ||
    isBusy(appointmentState);

  useEffect(() => {
    if (settingsState === 'NOT_FETCHED') {
      fetchSettings();
    }
  }, [fetchSettings, settingsState]);

  useEffect(() => {
    if (!user && isLoggedIn) {
      getMe();
    }
  });

  const {
    cookiebotDomainGroupId,
    googleAnalyticsMeasurementId,
    giosgCompanyId,
  } = settings?.scripts ?? {};

  if (maintenance) {
    return (
      <ThemeProvider theme={theme}>
        <MaintenancePage text={maintenance.reason} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Cookiebot cbid={cookiebotDomainGroupId} />
      <Analytics gaMeasurementId={googleAnalyticsMeasurementId} />
      {isLoggedIn && <Chat giosgCompanyId={giosgCompanyId} />}

      <Dimmer inverted active={appIsLoading} style={{ position: 'fixed' }}>
        <Loader size="massive" />
      </Dimmer>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
});

export default App;
