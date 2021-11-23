import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useStore } from '../../store/storeContext';
import useWindowDimensions from '../../utils/hooks';
import NoPrint from '../NoPrint';
import NavBar from './NavBar';
import UserMenu from './UserMenu';
import Wrapper from './Wrapper';

export const HEADER_HEIGHT = 120; // px
export const HEADER_HEIGHT_MOBILE = 70; // px

const StyledHeader = styled.header`
  .header__wrapper {
    height: ${HEADER_HEIGHT}px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media ${p => p.theme.breakpoint.mobile} {
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

  .mobile-header__menus {
    position: fixed;
    z-index: 1;
    right: ${p => p.theme.spacing.lg};
  }
`;

const Header: React.FC = observer(() => {
  const { isTablet } = useWindowDimensions();
  const {
    settings: { settings },
  } = useStore();

  const { logo } = settings ?? {};
  const logoHeight = isTablet ? HEADER_HEIGHT_MOBILE - 10 : HEADER_HEIGHT - 20;

  return (
    <StyledHeader>
      <Wrapper className="header__wrapper">
        <div data-testid="header__logo--container">
          {logo && (
            <Link to="/">
              <img src={logo.url} height={`${logoHeight}px`} alt="logo" />
            </Link>
          )}
        </div>

        {isTablet ? (
          <div className="mobile-header__menus">
            <div>
              <NoPrint>
                <UserMenu />
              </NoPrint>
            </div>
            <div>
              <NoPrint>
                <NavBar />
              </NoPrint>
            </div>
          </div>
        ) : (
          <>
            <div>
              <NoPrint>
                <NavBar />
              </NoPrint>
            </div>
            <div>
              <NoPrint>
                <UserMenu />
              </NoPrint>
            </div>
          </>
        )}
      </Wrapper>
    </StyledHeader>
  );
});

export default Header;
