import { configure } from '@guinie/selenium';
import { runTests as runLoginTests } from './login.test.gui';

// Produce a selenium context with default config
const { wrapDriver, getChromeDriver, closeDriver, context } = configure();

describe('Opinvoimala', () => {
  let driver: any;
  const getDriver = () => driver;

  beforeAll(async function () {
    // Produce a chrome driver
    driver = getChromeDriver({ headless: false });
  });

  beforeEach(async function () {
    // Navigate to page
    try {
      await driver.executeScript('localStorage.clear()');
    } catch (e) {}
    await driver.get('http://localhost:3000');
  });

  afterAll(async function () {
    // Close driver when all tests finish
    await closeDriver(driver);
  });

  runLoginTests({
    getDriver,
    context,
    wrapDriver,
  });
});
