import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Divider, Transition } from 'semantic-ui-react';
import { Input, Button } from '../../components/inputs';
import Layout from '../../components/Layout';
import { useStore } from '../../store/storeContext';
import { validatePassword } from '../../utils/string';
import Message from '../../components/Message';
import { useQueryParams } from '../../routes/hooks';
import { getApiErrorMessages } from '../../utils/api';
import Annotation from '../../components/Annotation';
import { COLORS } from '../../theme';

interface Props {}

export const ResetPassword: React.FC<Props> = observer(() => {
  const { t } = useTranslation();
  const { code } = useQueryParams('code');

  const {
    auth: { state, resetPassword },
  } = useStore();

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const isValidForm = password1 === password2 && validatePassword(password1);
  const isBusy = state === 'PROCESSING';

  const clearInputs = () => {
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
        code: code ?? '404',
        password: password1,
        passwordConfirmation: password2,
      };

      const { success, error } = await resetPassword(params);

      if (success) {
        clearInputs();
        setPasswordChanged(true);
        window.scrollTo(0, 0);
      } else {
        setErrorMsgs(getApiErrorMessages(error.data));
      }
    } else if (!isBusy) {
      if (password1 !== password2)
        setErrorMsgs([t('error.Auth.form.error.password.matching')]);
      else if (!validatePassword(password1))
        setErrorMsgs([t('error.Auth.form.error.password.not_valid')]);
    }
  };

  const hero = {
    title: t('route.reset_password'),
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
                content={`${t('view.reset_password.password_changed')}!`}
              />
            </div>
          )}
        </Transition.Group>

        <Annotation
          simple
          text={t('annotation.asterisk_is_required')}
          prefix={<span style={{ color: COLORS.accent }}>* </span>}
        />

        <h3>{t('view.reset_password.info_text')}</h3>
        <p>{t('view.change_password.new_password_info')}</p>

        <Input
          required
          autoFocus
          id="reset-password-view__password-input"
          label={t('label.password')}
          name="password"
          type="password"
          value={password1}
          onChange={handleChange(setPassword1)}
        />
        <Input
          required
          id="reset-password-view__confirm-password-input"
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
                header={t('view.reset_password.error_message_header')}
                list={errorMsgs}
              />
            </div>
          )}
        </Transition.Group>

        <Divider hidden aria-hidden="true" />

        <Button
          id="reset-password-view__reset_password-button"
          text={t('action.change_password')}
          type="submit"
          disabled={isBusy}
          noMargin
        />
      </form>
    </Layout>
  );
});
