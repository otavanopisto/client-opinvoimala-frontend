import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Image } from '../../store/models';
import useWindowDimensions from '../../utils/hooks';
import Icon from '../Icon';
import { Button } from '../inputs';
import NoPrint from '../NoPrint';
import Watermark from './Watermark';

const Container = styled.div`
  margin-bottom: -40px;
  position: relative;
  display: flex;
  justify-content: space-between;

  .hero {
    &__main-column {
      flex: 1;
      h1 {
        line-height: 77px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    &__side-column {
      position: absolute;
      right: 0;
      top: 0;
      width: 30%;
    }

    &__side-column-placeholder {
      width: 35%;
    }

    &__back-button-label {
      display: flex;
      align-items: center;

      svg {
        margin-left: -10px;
        margin-right: 5px;
      }
    }

    &__action-buttons {
      display: flex;
      flex-wrap: wrap;
      > button {
        :not(:last-child) {
          margin-right: ${p => p.theme.spacing.md};
        }
      }
    }
  }

  @media ${p => p.theme.breakpoint.tablet} {
    .hero {
      &__main-column {
        h1 {
          flex-direction: column;
          align-items: flex-start;
        }
      }
      &__action-buttons {
        margin-top: ${p => p.theme.spacing.lg};
      }
    }
  }

  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: column;
    align-items: center;
    .hero {
      &__side-column,
      &__main-column {
        position: initial;
        width: 100%;
      }
      &__side-column {
        > div > img {
          margin-top: ${p => p.theme.spacing.xl};
          margin-bottom: -${p => p.theme.spacing.xl};
        }
      }
      &__main-column {
        h1 {
          line-height: 43px;
        }
        &.align-center {
          text-align: center;
        }
        > div > img {
          width: 80px;
          float: left;
          margin-right: ${p => p.theme.spacing.lg};
        }
      }
    }
  }
`;

export interface HeroProps {
  title?: string | null | JSX.Element;
  lead?: string | JSX.Element | null;
  image?: Image | null;
  smallImage?: boolean;
  align?: string;
  goBackText?: string;
  showGoBack?: boolean;
  onGoBackClick?: () => void;
  actions?: {
    id: string;
    text?: string | JSX.Element;
    icon?: JSX.Element;
    onClick: () => void;
  }[];
}

const Hero: React.FC<HeroProps> = ({
  title,
  lead,
  image,
  smallImage,
  align = 'left',
  goBackText,
  showGoBack,
  onGoBackClick,
  actions,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isMobile } = useWindowDimensions();

  const handleGoBack = () => {
    if (onGoBackClick) {
      onGoBackClick();
    } else {
      history.goBack();
    }
  };

  const goBackButton = (
    <Button
      id="hero__back-button"
      onClick={handleGoBack}
      isSmall
      text={
        <div className="hero__back-button-label">
          <Icon type="ChevronLeft" />
          {goBackText ?? t('action.go_back')}
        </div>
      }
    />
  );

  const imageEl = !image?.url ? undefined : (
    <img src={image?.url} alt="" width={smallImage ? '150px' : '300px'} />
  );

  const actionButtons = actions?.map(({ id, text, icon, onClick }) => (
    <Button
      key={id}
      id={id}
      text={text}
      color="primary"
      icon={icon}
      onClick={onClick}
    />
  ));

  return (
    <Container>
      <Watermark isNegative left={-220} top={40} />

      <div className={`hero__main-column align-${align}`}>
        {(showGoBack || goBackText || onGoBackClick) && (
          <NoPrint>{goBackButton}</NoPrint>
        )}

        <h1 data-testid="hero__title">
          {title}
          {!!actionButtons?.length && (
            <NoPrint>
              <div className="hero__action-buttons">{actionButtons}</div>
            </NoPrint>
          )}
        </h1>

        {isMobile && smallImage && <NoPrint>{imageEl}</NoPrint>}
        <div>{lead}</div>
      </div>

      {imageEl && (!isMobile || !smallImage) && (
        <>
          <div className="hero__side-column">
            <NoPrint>{imageEl}</NoPrint>
          </div>
          <div className="hero__side-column-placeholder"></div>
        </>
      )}
    </Container>
  );
};

export default Hero;
