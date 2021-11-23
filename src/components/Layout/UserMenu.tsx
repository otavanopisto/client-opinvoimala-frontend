import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { path, rt } from '../../routes/routes';
import Icon from '../Icon';
import Button from '../inputs/Button';
import DropdownMenu from '../DropdownMenu';
import useWindowDimensions from '../../utils/hooks';
import Drawer from '../Drawer';
import { useStore } from '../../store/storeContext';
import { LinkIn } from '../../store/models';
import Link from '../Link';

const DesktopMenu: React.FC<{ items: LinkIn[] }> = ({ items }) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu
      data-testid="user-menu"
      items={items}
      align="right"
      verticalPosition={20}
      color="primary"
      triggerEl={(isOpen, onClick) => (
        <Button
          ariaLabel={t('aria.user_menu')}
          aria-expanded={isOpen}
          aria-haspopup={true}
          id="user-menu__button"
          text={t('student')}
          icon={<Icon type="User" color="primary" />}
          variant="link"
          onClick={onClick}
        />
      )}
    />
  );
};

const MobileMenu: React.FC<{ items: LinkIn[] }> = ({ items }) => {
  const { t } = useTranslation();
  return (
    <Drawer
      triggerEl={(isOpen, onClick) => (
        <Button
          ariaLabel={t('aria.user_menu')}
          aria-expanded={isOpen}
          id="user-menu__button"
          variant="outlined"
          color="secondary"
          icon={<Icon type="User" color="secondary" />}
          onClick={onClick}
        />
      )}
    >
      <ul className="drawer__link-list">
        {items.map(link => (
          <li key={link.id}>
            <Link link={link}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </Drawer>
  );
};

const UserMenu: React.FC = observer(() => {
  const { t } = useTranslation();

  const { isTablet } = useWindowDimensions();

  const {
    auth: { isLoggedIn, openLoginModal },
  } = useStore();

  const handleLoginClick = () => {
    openLoginModal();
  };

  if (isLoggedIn) {
    const items: LinkIn[] = [
      {
        id: 'my_profile',
        label: rt('well_being_profile'),
        type: 'internal',
        internal: `/${path('well_being_profile')}`,
      },
      {
        id: 'tests',
        label: rt('tests'),
        type: 'internal',
        internal: `/${path('tests')}`,
      },
      {
        id: 'appointments',
        label: rt('appointments'),
        type: 'internal',
        internal: `/${path('appointments')}`,
      },
      {
        id: 'change_password',
        label: rt('change_password'),
        type: 'internal',
        internal: `/${path('change_password')}`,
      },
      {
        id: 'logout',
        label: rt('logout'),
        type: 'internal',
        internal: `/${path('logout')}`,
      },
    ];

    return isTablet ? (
      <MobileMenu items={items} />
    ) : (
      <DesktopMenu items={items} />
    );
  } else {
    // User is not logged in, show login button.
    return (
      <Button
        ariaLabel={t('aria.login')}
        id="user-menu__login__button"
        text={isTablet ? undefined : t('action.login')}
        variant={isTablet ? 'outlined' : 'filled'}
        color="secondary"
        icon={
          <Icon type="SignIn" color={isTablet ? 'secondary' : 'background'} />
        }
        onClick={handleLoginClick}
      />
    );
  }
});

export default UserMenu;
