import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { adminPath } from '../../routes/routesAdmin';
import { useStore } from '../../store/storeContext';
import { useWindowDimensions } from '../../utils/hooks';
import NoPrint from '../NoPrint';
import NavBar from './NavBar';
import UserMenu from './UserMenu';
import Wrapper from './Wrapper';
import Image from '../Image';

export const HEADER_HEIGHT = 120; // px
export const HEADER_HEIGHT_MOBILE = 70; // px

const StyledHeader = styled.header`
  nav {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    .nav-bar {
      flex-grow: 1;
    }
  }
  .header__wrapper {
    height: ${HEADER_HEIGHT}px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media ${p => p.theme.breakpoint.mobile} and not print {
      height: ${HEADER_HEIGHT_MOBILE}px;
    }

    & > div {
      display: flex;
      > div {
        :not(:last-child) {
          margin-right: ${p => p.theme.spacing.lg};
        }
      }
    }
  }

  .header__-container {
    display: flex;
    align-items: center;
    a.admin-title {
      margin-left: ${p => p.theme.spacing.lg};
      padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.md};
      background-color: ${p => p.theme.color.accent};
      color: ${p => p.theme.color.background};
      border-radius: ${p => p.theme.borderRadius.md};
      ${p => p.theme.font.size.sm};
      font-weight: bold;
      text-transform: uppercase;
    }
  }

  .header__logo-container {
    z-index 6;
  }

  .mobile-header__menus {
    position: fixed;
    z-index: 6;
    right: ${p => p.theme.spacing.lg};
  }
`;

interface Props {
  admin?: boolean;
}

const Header: React.FC<Props> = observer(({ admin }) => {
  const { t } = useTranslation();
  const { isTablet } = useWindowDimensions();
  const {
    settings: { settings },
  } = useStore();

  const { logo } = settings ?? {};
  const logoHeight = isTablet ? HEADER_HEIGHT_MOBILE - 10 : HEADER_HEIGHT - 20;

  return (
    <StyledHeader>
      <Wrapper className="header__wrapper">
        <div className="header__logo-container">
          {logo && (
            <Link to="/">
              <Image apiSrc={logo.url} height={`${logoHeight}px`} alt="logo" />
            </Link>
          )}
          {admin && (
            <Link to={adminPath()} className="admin-title">
              {t('route.admin.root')}
            </Link>
          )}
        </div>

        {isTablet ? (
          <div className="mobile-header__menus">
            <NoPrint>
              <nav>
                <div className="user-menu user-menu--mobile">
                  <UserMenu admin={admin} />
                </div>
                <div className="nav-bar nav-bar--mobile">
                  <NavBar admin={admin} />
                </div>
              </nav>
            </NoPrint>
          </div>
        ) : (
          <NoPrint>
            <nav>
              <div className="nav-bar">
                <NavBar admin={admin} />
              </div>
              <div className="user-menu">
                <UserMenu admin={admin} />
              </div>
            </nav>
          </NoPrint>
        )}
      </Wrapper>
    </StyledHeader>
  );
});

export default Header;
