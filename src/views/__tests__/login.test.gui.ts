import { sequence, applyContext } from '@guinie/selenium';
import { waitForApi } from '../../utils/test-utils';
import * as loginActions from './actions/login';

interface Props {
  getDriver: any;
  context: any;
  wrapDriver: any;
}

export const runTests = ({ getDriver, context, wrapDriver }: Props) => {
  // Get the context bound `findElement` function from context
  const { findElement } = context;

  // Bind send passcode UI actions to context
  const [login] = applyContext(loginActions.login)(context);

  test('Login', async () => {
    // Get a wrapped selenium driverState
    const driverState = wrapDriver(getDriver());

    // Produce a complex sequence of actions and run it on selenium driverState
    await sequence(
      login({
        email: 'toni.weckroth@geniem.com',
        password: 'Password1',
      })
    )(driverState);

    waitForApi(1000);

    const element = await findElement('user-menu', {
      timeout: 1000,
    })(driverState);

    console.log(await element.isDisplayed());

    expect(await element.isDisplayed()).toBe(true);

    // const element2 = await $('#header__logo--container');

    // expect(element2.getValue()).toBeInTheDocument();

    // Verify that the desired UI state is reached
    // try {
    //   const element = await findElement('header__logo--containerrr', {
    //     timeout: 500,
    //   })(driverState);

    //   expect(element).toBeInTheDocument();

    //   console.log(element);
    //   throw new Error('User menu not found');
    // } catch (err) {
    //   console.log('ERROR', err);
    //   return;
    // }
  });
};
