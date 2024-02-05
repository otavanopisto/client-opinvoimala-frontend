import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { path, rt } from '../../routes/routes';
import { adminPath } from '../../routes/routesAdmin';
import Icon from '../Icon';
import Button from '../inputs/Button';
import DropdownMenu from '../DropdownMenu';
import { useWindowDimensions } from '../../utils/hooks';
import Drawer from '../Drawer';
import { useStore } from '../../store/storeContext';
import Link, { LinkItem } from '../Link';
import { useAdminStore } from '../../store/admin/adminStoreContext';
import { useHistory } from 'react-router-dom';

const UserIconContainer = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 12px;
  border: 2px solid ${p => p.theme.color.primary};
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media ${p => p.theme.breakpoint.laptop} {
    margin-left: 0;
  }

  ${p => p.theme.shadows[1]};
`;

const DesktopMenu: React.FC<{ items: LinkItem[]; text?: string }> = ({
  items,
  text,
}) => {
  const { t } = useTranslation();
  const { isLaptop } = useWindowDimensions();
  const label = text ? text : t('student');

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
          text={isLaptop ? undefined : label}
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
            <Link link={link} label={link.label} />
          </li>
        ))}
      </ul>
    </Drawer>
  );
};

const LoginContainer = styled.div`
  margin-left: 12px;
`;

interface Props {
  admin?: boolean;
}

const UserMenu: React.FC<Props> = observer(({ admin }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { isTablet } = useWindowDimensions();

  const {
    auth: { isLoggedIn, openLoginModal },
  } = useStore();

  const {
    auth: { isLoggedIn: isAdminLoggedIn, adminName, logout: adminLogout },
  } = useAdminStore();
  const isAdminPath = history?.location.pathname.includes(adminPath());

  const handleLoginClick = () => {
    openLoginModal();
  };

  let items: LinkItem[] = [];

  if (isAdminLoggedIn && isAdminPath) {
    items = [
      {
        id: 'admin_appointments',
        label: rt('admin.appointments'),
        type: 'internal',
        internal: adminPath('admin.appointments'),
      },
      {
        id: 'admin_appointment_specialists',
        label: rt('admin.appointment_specialists'),
        type: 'internal',
        internal: adminPath('admin.appointment_specialists'),
      },
      {
        id: 'logout',
        label: rt('logout'),
        type: 'button',
        onClick: () => adminLogout(),
      },
    ];
    if (isTablet) return <MobileMenu items={items} />;
    return <DesktopMenu items={items} text={adminName} />;
  } else if (isLoggedIn && !isAdminPath) {
    items = [
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
        id: 'events',
        label: rt('events'),
        type: 'internal',
        internal: `/${path('events')}`,
      },
      {
        id: 'user_profile',
        label: rt('user_profile'),
        type: 'internal',
        internal: `/${path('user_profile')}`,
      },
      {
        id: 'logout',
        label: rt('logout'),
        type: 'internal',
        internal: `/${path('logout')}`,
      },
    ];

    return (
      <>
        {isTablet ? (
          <MobileMenu items={items} />
        ) : (
          <DesktopMenu items={items} />
        )}
      </>
    );
  } else if (!admin) {
    // User is not logged in, show login button.
    return (
      <LoginContainer>
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
      </LoginContainer>
    );
  }
  return null;
});

export default UserMenu;
