import React, { ReactElement } from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import { StoreProvider } from '../store/storeContext';
import { rootStore } from '../store/RootStore';
import { theme, ThemeProvider } from '../theme';
import '../i18n';

function render(ui: ReactElement, { ...renderOptions }: any = {}) {
  const Wrapper: React.FC = ({ children }) => {
    return (
      <StoreProvider value={rootStore}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StoreProvider>
    );
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export const waitForApi = async (timeout = 100) =>
  waitFor(() => null, { timeout });

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
