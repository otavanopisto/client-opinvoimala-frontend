import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Header from './Header';
import Hero, { HeroProps } from './Hero';
import Wrapper, { WrapperSize } from './Wrapper';
import LoadingPlaceholder from '../LoadingPlaceholder';
import { LoginModal } from '../../views';

const Container = styled.div`
  .header {
    &__header,
    &__hero {
      background-color: ${p => p.theme.color.primaryLight};
    }
    &__hero {
      padding-top: 50px;
    }
  }
  > main {
    background-color: ${p => p.theme.color.background};
    position: relative;
    padding-bottom: 60px;
  }

  @media print {
    .header {
      &__header,
      &__hero {
        background-color: ${p => p.theme.color.background};
      }
    }
  }
`;

const DiagonalSeparator = styled.div`
  height: 200px;
  background: linear-gradient(
    -182deg,
    ${p => p.theme.color.primaryLight} 50%,
    transparent 0%
  );

  @media ${p => p.theme.breakpoint.tablet} {
    height: 150px;
  }

  @media ${p => p.theme.breakpoint.mobile} {
    height: 120px;
    background: linear-gradient(
      -183deg,
      ${p => p.theme.color.primaryLight} 50%,
      transparent 0%
    );
  }

  @media print {
    height: 70px;
    background: transparent;
  }
`;

interface Props {
  wrapperSize?: WrapperSize;
  hero?: HeroProps;
  isLoading?: boolean;
  admin?: boolean;
}

const Layout: React.FC<Props> = ({
  hero,
  wrapperSize = 'normal',
  isLoading = false,
  admin = false,
  children,
}) => {
  return (
    <Container>
      {!admin && <LoginModal />}

      <div className="header__header">
        <Header admin={admin} />
      </div>

      <main>
        {hero && (
          <div className="header__hero">
            <Wrapper size={wrapperSize}>
              {isLoading ? (
                <LoadingPlaceholder.Hero />
              ) : (
                <Hero {...hero} wrapperSize={wrapperSize} />
              )}
            </Wrapper>
          </div>
        )}

        <DiagonalSeparator />

        <Wrapper size={wrapperSize}>
          {isLoading ? <LoadingPlaceholder.Content /> : children}
        </Wrapper>
      </main>

      <Footer />
    </Container>
  );
};

export default Layout;
