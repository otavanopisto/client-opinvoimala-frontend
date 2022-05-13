import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Divider, Loader, Transition } from 'semantic-ui-react';
import styled from 'styled-components';
import { path } from '../../routes/routes';
import { useStore } from '../../store/storeContext';
import { getApiErrorMessages } from '../../utils/api';
import { Button, Input } from '../../components/inputs';
import Message from '../../components/Message';
import Modal, { Props as ModalProps } from '../../components/Modal';

const Container = styled.div`
  text-align: center;

  h2 {
    ${p => p.theme.font.h3};
  }

  a {
    color: ${p => p.theme.color.secondary};
    text-decoration: underline;
    :hover {
      color: ${p => p.theme.color.secondary};
      text-decoration: none;
    }
  }

  button {
    width: 100%;
  }

  & > div {
    margin-top: ${p => p.theme.spacing.md};
  }

  .message {
    margin-bottom: ${p => p.theme.spacing.md} !important;
    text-align: left !important;
  }
`;

interface Props extends ModalProps {}

export const LoginModal: React.FC<Props> = observer(({ ...props }) => {
  const { t } = useTranslation();

  const {
    auth: { state, showLoginModal, closeLoginModal, login },
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const isBusy = state === 'PROCESSING';

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setErrorMsgs([]);
      setter(event.currentTarget.value);
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isBusy) {
      setErrorMsgs([]);

      const { success, error } = await login({ identifier: email, password });

      if (success) {
        setEmail('');
        setPassword('');
        closeLoginModal();
      } else {
        setErrorMsgs(getApiErrorMessages(error.data));
      }
    }
  };

  const handleClose = () => {
    setPassword('');
    closeLoginModal();
  };

  return (
    <Modal {...props} open={showLoginModal} onClose={handleClose} size="mini">
      <Container>
        <form onSubmit={handleSubmit}>
          <h2>{t('view.login.title')}</h2>

          <Loader disabled={!isBusy} size="massive" />

          <Transition.Group>
            {!!errorMsgs.length && (
              <div>
                <Message
                  error
                  header={t('view.login.error_message_header')}
                  list={errorMsgs}
                />
              </div>
            )}
          </Transition.Group>

          <Input
            autoFocus
            id="login-modal__email-input"
            placeholder={t('label.email')}
            label={t('label.email')}
            icon="user"
            iconPosition="left"
            name="username"
            type="email"
            value={email}
            onChange={handleChange(setEmail)}
            size="large"
          />
          <Input
            id="login-modal__password-input"
            placeholder={t('label.password')}
            label={t('label.password')}
            icon="lock"
            iconPosition="left"
            name="password"
            type="password"
            value={password}
            onChange={handleChange(setPassword)}
            size="large"
          />
          <Button
            id="login-modal__login-button"
            text={t('action.login')}
            type="submit"
            disabled={isBusy}
            noMargin
          />
        </form>

        <Divider hidden aria-hidden="true" />

        <div>
          <Trans i18nKey="view.login.forgot_password_link">
            <Link to={`/${path('forgot_password')}`} onClick={handleClose}>
              Forgot password?
            </Link>
          </Trans>
        </div>
      </Container>
    </Modal>
  );
});

export default LoginModal;
