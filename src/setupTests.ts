// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

import { server } from './mocks/server';

// Establish API mocking before all tests.
beforeAll(() =>
  server.listen({
    onUnhandledRequest: ({ method, url }) => {
      const sessionPath = url.pathname.startsWith('/session');
      const statusPath = url.pathname.startsWith('/status');
      const bypassPath = sessionPath || statusPath;
      if (!bypassPath) {
        console.log(`Unhandled ${method} request to ${url}`);
      }
    },
  })
);

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
