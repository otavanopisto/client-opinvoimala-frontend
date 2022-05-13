import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { Button, Input } from '../../components/inputs';
import Layout from '../../components/Layout';
import { adminPath } from '../../routes/routesAdmin';
import { useAdminStore } from '../../store/admin/adminStoreContext';

const AdminLogin: React.FC = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    auth: { state, login, isLoggedIn },
  } = useAdminStore();

  const isBusy = state === 'PROCESSING';

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.currentTarget.value);
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isBusy) {
      login({ email, password });
    }
  };

  const hero = {
    title: t('route.admin.root'),
  };

  if (isLoggedIn) {
    return <Redirect to={adminPath()} />;
  }

  return (
    <Layout admin hero={hero} wrapperSize="sm">
      <form onSubmit={handleSubmit}>
        <h2>{t('view.login.title')}</h2>

        <Loader disabled={!isBusy} size="massive" />

        <Input
          autoFocus
          id="admin-login__email-input"
          placeholder={t('label.email')}
          label={t('label.email')}
          icon="user"
          iconPosition="left"
          name="username"
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
          size="small"
        />
        <Input
          id="admin-login__password-input"
          placeholder={t('label.password')}
          label={t('label.password')}
          icon="lock"
          iconPosition="left"
          name="password"
          type="password"
          value={password}
          onChange={handleChange(setPassword)}
          size="small"
        />
        <Button
          id="admin-login__login-button"
          text={t('action.login')}
          type="submit"
          disabled={isBusy}
          noMargin
        />
      </form>
    </Layout>
  );
};

export default AdminLogin;
