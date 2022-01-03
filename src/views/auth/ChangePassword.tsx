import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Divider, Transition } from 'semantic-ui-react';
import { Input, Button } from '../../components/inputs';
import Layout from '../../components/Layout';
import { useStore } from '../../store/storeContext';
import { validatePassword } from '../../utils/string';
import Message from '../../components/Message';
import Annotation from '../../components/Annotation';
import { COLORS } from '../../theme';

export const ChangePassword: React.FC = observer(() => {
  const { t } = useTranslation();

  const {
    auth: { state, changePassword },
  } = useStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const isValidPw = password1 === password2 && validatePassword(password1);
  const isValidForm = !!currentPassword.length && isValidPw;

  const isBusy = state === 'PROCESSING';

  const clearInputs = () => {
    setCurrentPassword('');
    setPassword1('');
    setPassword2('');
  };

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setErrorMsgs([]);
      setPasswordChanged(false);
      setter(event.currentTarget.value);
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidForm && !isBusy) {
      setErrorMsgs([]);
      setPasswordChanged(false);

      const params = {
        currentPassword,
        newPassword: password1,
        newPasswordConfirm: password2,
      };

      const { success, error } = await changePassword(params);

      if (success) {
        clearInputs();
        setPasswordChanged(true);
        window.scrollTo(0, 0);
      } else if (error.message) {
        setErrorMsgs([t(`error.${error.message}`)]);
      } else {
        setErrorMsgs([t(`error.unknown_error`)]);
      }
    } else if (!isBusy) {
      if (password1 !== password2)
        setErrorMsgs([t('error.Auth.form.error.password.matching')]);
      else if (!validatePassword(password1))
        setErrorMsgs([t('error.Auth.form.error.password.not_valid')]);
    }
  };

  const hero = {
    title: t('route.change_password'),
  };

  return (
    <Layout hero={hero} wrapperSize="sm">
      <form onSubmit={handleSubmit}>
        <Transition.Group>
          {passwordChanged && (
            <div>
              <Message
                success
                icon="check circle"
                content={`${t('view.change_password.password_changed')}!`}
              />
            </div>
          )}
        </Transition.Group>

        <Annotation
          simple
          text={t('annotation.asterisk_is_required')}
          prefix={<span style={{ color: COLORS.accent }}>* </span>}
        />

        <h3>{t('view.change_password.current_password_title')}</h3>

        <Input
          required
          autoFocus
          id="change-password-view__current-password-input"
          label={t('label.password')}
          name="password"
          type="password"
          value={currentPassword}
          onChange={handleChange(setCurrentPassword)}
        />

        <Divider hidden />

        <h3>{t('view.change_password.new_password_title')}</h3>
        <p>{t('view.change_password.new_password_info')}</p>

        <Input
          required
          id="change-password-view__password-input"
          label={t('label.password')}
          name="password"
          type="password"
          value={password1}
          onChange={handleChange(setPassword1)}
        />
        <Input
          required
          id="change-password-view__confirm-password-input"
          label={t('label.password_confirm')}
          name="confirm-password"
          type="password"
          value={password2}
          onChange={handleChange(setPassword2)}
        />

        <Transition.Group>
          {!!errorMsgs.length && (
            <div>
              <Message
                error
                icon="warning sign"
                header={t('view.change_password.error_message_header')}
                list={errorMsgs}
              />
            </div>
          )}
        </Transition.Group>

        <Divider hidden />

        <Button
          id="change-password-view__change_password-button"
          text={t('action.change_password')}
          type="submit"
          disabled={isBusy}
          noMargin
        />
      </form>
    </Layout>
  );
});
