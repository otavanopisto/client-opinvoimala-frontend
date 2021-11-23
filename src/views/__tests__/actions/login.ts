// @ts-nocheck
import { sequence, compose } from '@guinie/common';

export const openLoginModal = context => params => {
  const { click } = context;
  return sequence(click('user-menu__login__button'));
};

export const sendLoginForm = context => params => {
  const { type, click } = context;
  return sequence(
    type('login-modal__email-input', params.email),
    type('login-modal__password-input', params.password),
    click('login-modal__login-button')
  );
};

export const login = compose(openLoginModal, sendLoginForm);
