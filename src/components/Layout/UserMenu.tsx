import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { path, rt } from '../../routes/routes';
import Icon from '../Icon';
import Button from '../inputs/Button';
import DropdownMenu from '../DropdownMenu';
import { useWindowDimensions } from '../../utils/hooks';
import Drawer from '../Drawer';
import { useStore } from '../../store/storeContext';
import Link, { LinkItem } from '../Link';
import DeleteAccountModal from '../../views/auth/DeleteAccountModal';

const UserIconContainer = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 12px;
  border: 2px solid ${p => p.theme.color.primary};
  border-radius: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  ${p => p.theme.shadows[1]};
`;

const DesktopMenu: React.FC<{ items: LinkItem[] }> = ({ items }) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu
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
          icon={
            <UserIconContainer>
              <Icon type="User" color="primary" />
            </UserIconContainer>
          }
          variant="link"
          onClick={onClick}
        />
      )}
    />
  );
};

const MobileMenu: React.FC<{ items: LinkItem[] }> = ({ items }) => {
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

  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const {
    auth: { isLoggedIn, openLoginModal },
  } = useStore();

  const handleLoginClick = () => {
    openLoginModal();
  };

  if (isLoggedIn) {
    const items: LinkItem[] = [
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
      {
        id: 'delete_account',
        label: t('view.delete_account.title'),
        type: 'button',
        onClick: () => {
          setDeleteAccountOpen(true);
        },
        style: 'alert',
      },
    ];

    return (
      <>
        {isTablet ? (
          <MobileMenu items={items} />
        ) : (
          <DesktopMenu items={items} />
        )}
        <DeleteAccountModal
          isOpen={deleteAccountOpen}
          onClose={() => {
            setDeleteAccountOpen(false);
          }}
        />
      </>
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
