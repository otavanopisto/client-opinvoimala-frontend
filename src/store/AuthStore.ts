import { Instance, types, flow, cast, getParent } from 'mobx-state-tree';
import api from '../services/api/Api';
import Storage from '../services/storage';
import { ANALYTICS_EVENT, sendAnalyticsEvent } from '../utils/analytics';

import { User, UserModel } from './models';

const States = ['IDLE' as const, 'PROCESSING' as const, 'ERROR' as const];

export const AuthStore = types
  .model({
    state: types.enumeration('State', States),

    jwt: types.optional(
      types.maybeNull(types.string),
      Storage.read({ key: 'AUTH_TOKEN' })
    ),
    user: types.maybeNull(UserModel),
    isLoginModalOpen: types.optional(types.boolean, false),
  })
  .views(self => ({
    get isLoggedIn() {
      return !!self.jwt?.length;
    },
    get showLoginModal() {
      return self.isLoginModalOpen && !this.isLoggedIn;
    },
  }))
  .actions(self => {
    const register = flow(function* (params: API.AuthRegister) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.Auth> = yield api.register(
        params
      );

      if (response.kind === 'ok') {
        sendAnalyticsEvent(ANALYTICS_EVENT.USER_REGISTERED);
        self.user = cast(response.data.user);
        self.jwt = cast(response.data.jwt);
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const openLoginModal = () => {
      if (!self.isLoggedIn) {
        self.isLoginModalOpen = true;
      }
    };

    const closeLoginModal = () => {
      self.isLoginModalOpen = false;
    };

    const login = flow(function* (params: API.AuthLogin) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.Auth> = yield api.login(
        params
      );

      if (response.kind === 'ok') {
        sendAnalyticsEvent(ANALYTICS_EVENT.USER_LOGGED_IN);

        // Reset tests store after successful login:
        const { tests } = getParent(self);
        tests.reset();

        self.user = cast(response.data.user);
        self.jwt = cast(response.data.jwt);
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const changePassword = flow(function* (params: API.AuthChangePassword) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.User> =
        yield api.changePassword(params);

      if (response.kind === 'ok') {
        self.user = cast(response.data);
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const forgotPassword = flow(function* (params: API.AuthForgotPassword) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.AuthForgotPassword> =
        yield api.forgotPassword(params);

      if (response.kind === 'ok') {
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const resetPassword = flow(function* (params: API.AuthResetPassword) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.Auth> =
        yield api.resetPassword(params);

      if (response.kind === 'ok') {
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const logout = flow(function* () {
      self.state = 'PROCESSING';

      self.jwt = null;
      self.user = null;
      Storage.write({ key: 'AUTH_TOKEN', value: null });
      Storage.write({ key: 'TESTS_IN_PROGRESS', value: null });
      yield api.logout();

      const { tests, contentPages } = getParent(self);
      tests.reset();
      contentPages.reset();

      self.state = 'IDLE';
    });

    const deleteAccount = flow(function* (params: API.DeleteAccount = {}) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.DeleteAccount> =
        yield api.deleteAccount(params);

      if (response.kind === 'ok') {
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const getMe = flow(function* (params: API.GetMe = {}) {
      self.state = 'PROCESSING';

      const response: API.GeneralResponse<API.RES.GetMe> = yield api.getMe(
        params
      );

      if (response.kind === 'ok') {
        self.user = cast(response.data);
        self.state = 'IDLE';
        return { success: true };
      } else {
        self.state = 'ERROR';
        return { success: false, error: response.data };
      }
    });

    const setUser = (user: User) => {
      self.user = cast(user);
    };

    return {
      register,
      openLoginModal,
      closeLoginModal,
      login,
      changePassword,
      forgotPassword,
      resetPassword,
      logout,
      deleteAccount,
      getMe,
      setUser,
    };
  });

export interface IAuthStore extends Instance<typeof AuthStore> {}
