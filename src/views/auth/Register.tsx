import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Divider, Transition } from 'semantic-ui-react';
import { Checkbox, Input } from '../../components/inputs';
import Button from '../../components/inputs/Button';
import Layout from '../../components/Layout';
import { path } from '../../routes/routes';
import { useStore } from '../../store/storeContext';
import { validatePassword } from '../../utils/string';
import { getApiErrorMessages } from '../../utils/api';
import Message from '../../components/Message';
import Annotation from '../../components/Annotation';
import { COLORS } from '../../theme';

interface Props {}

export const Register: React.FC<Props> = observer(() => {
  const history = useHistory();
  const { t } = useTranslation();

  const {
    auth: { state, isLoggedIn, register },
  } = useStore();

  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const isValidPw = password1 === password2 && validatePassword(password1);
  const isValidForm = !!email.length && isValidPw && termsAccepted;

  const isBusy = state === 'PROCESSING';

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setErrorMsgs([]);
      setter(event.currentTarget.value);
    };

  const getClientErrors = () => {
    const errors: string[] = [];
    const tPrefix = 'error.Auth.form.error';

    if (!validatePassword(password1))
      errors.push(t(`${tPrefix}.password.not_valid`));
    else if (password1 !== password2)
      errors.push(t(`${tPrefix}.password.matching`));
    if (!termsAccepted) errors.push(t(`${tPrefix}.terms.not_accepted`));
    if (!email.length) errors.push(t(`${tPrefix}.email.provide`));

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsgs([]);
    if (isValidForm && !isBusy) {
      const params = { email, password: password1, termsAccepted };

      const { success, error } = await register(params);

      if (success) {
        history.push('/');
      } else {
        setErrorMsgs(getApiErrorMessages(error.data));
      }
    } else if (!isBusy) {
      setErrorMsgs(getClientErrors());
    }
  };

  const hero = {
    title: t('route.register'),
  };

  const getTermsAndConditionsLabel = () => {
    const origin = window.location.origin.toString();
    const termsLink = (
      <a href={`${origin}/${path('terms')}`} target="_blank" rel="noreferrer">
        terms
      </a>
    );
    const conditionsLink = (
      <a
        href={`${origin}/${path('conditions')}`}
        target="_blank"
        rel="noreferrer"
      >
        conditions
      </a>
    );
    return (
      <Trans i18nKey="view.register.terms_and_conditions_text">
        I accept {termsLink} and {conditionsLink}
      </Trans>
    );
  };

  if (isLoggedIn) {
    return (
      <Layout hero={hero} wrapperSize="sm">
        <Message
          header={t('view.register.already_logged_in')}
          content={<Link to={path('logout')}>{t('route.logout')}</Link>}
        />
      </Layout>
    );
  }

  return (
    <Layout hero={hero} wrapperSize="sm">
      <form onSubmit={handleSubmit}>
        <h3>{t('view.register.email_title')}</h3>
        <p>{t('view.register.email_info')}</p>

        <Input
          required
          autoFocus
          id="register-view__email-input"
          label={t('label.email')}
          name="email"
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
        />

        <Divider hidden />

        <h3>{t('view.register.password_title')}</h3>

        <p>{t('view.register.password_info')}</p>

        <Input
          required
          id="register-view__password-input"
          label={t('label.password')}
          name="password"
          type="password"
          value={password1}
          onChange={handleChange(setPassword1)}
        />
        <Input
          required
          id="register-view__confirm-password-input"
          label={t('label.password_confirm')}
          name="confirm-password"
          type="password"
          value={password2}
          onChange={handleChange(setPassword2)}
        />
        <Checkbox
          id="register-view__terms_and_conditions_checkbox"
          label={getTermsAndConditionsLabel()}
          checked={termsAccepted}
          onChange={() => setTermsAccepted(!termsAccepted)}
        />

        <Transition.Group>
          {!!errorMsgs.length && (
            <div>
              <Message
                error
                icon="warning sign"
                header={t('view.register.error_message_header')}
                list={errorMsgs}
              />
            </div>
          )}
        </Transition.Group>

        <Divider hidden />

        <Button
          id="register-view__register-button"
          text={t('action.register')}
          type="submit"
          disabled={isBusy}
          noMargin
        />

        <Annotation
          simple
          text={t('annotation.asterisk_is_required')}
          prefix={<span style={{ color: COLORS.accent }}>* </span>}
        />
      </form>
    </Layout>
  );
});
