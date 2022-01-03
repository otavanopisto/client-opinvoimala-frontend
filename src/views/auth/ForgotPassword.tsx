import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Transition } from 'semantic-ui-react';
import Annotation from '../../components/Annotation';
import { Button, Input } from '../../components/inputs';
import Layout from '../../components/Layout';
import Message from '../../components/Message';
import { useStore } from '../../store/storeContext';
import { COLORS } from '../../theme';
import { getApiErrorMessages } from '../../utils/api';

export const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();

  const {
    auth: { state, forgotPassword },
  } = useStore();

  const [email, setEmail] = useState('');
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [linkSent, setLinkSent] = useState(false);

  const isValidForm = !!email.length;
  const isBusy = state === 'PROCESSING';

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setErrorMsgs([]);
      setLinkSent(false);
      setter(event.currentTarget.value);
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidForm && !isBusy) {
      setErrorMsgs([]);
      setLinkSent(false);
      const { success, error } = await forgotPassword({ email });

      if (success) {
        setEmail('');
        setLinkSent(true);
        window.scrollTo(0, 0);
      } else {
        setErrorMsgs(getApiErrorMessages(error.data));
      }
    }
  };

  const hero = {
    title: `${t('route.forgot_password')}?`,
  };

  return (
    <Layout hero={hero} wrapperSize="sm">
      <form onSubmit={handleSubmit}>
        <Transition.Group>
          {linkSent && (
            <div>
              <Message
                success
                icon="check circle"
                content={`${t('view.forgot_password.link_sent')}!`}
              />
            </div>
          )}
        </Transition.Group>

        <p>{t('view.forgot_password.info_text')}</p>

        <Annotation
          simple
          text={t('annotation.asterisk_is_required')}
          prefix={<span style={{ color: COLORS.accent }}>* </span>}
        />

        <Input
          required
          autoFocus
          id="forgot-password-view__email-input"
          label={t('label.email')}
          name="email"
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
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

        <Divider hidden aria-hidden="true" />

        <Button
          id="forgot-password-view__send-button"
          text={t('action.send_link')}
          type="submit"
          disabled={!isValidForm || isBusy}
          noMargin
        />
      </form>
    </Layout>
  );
};
