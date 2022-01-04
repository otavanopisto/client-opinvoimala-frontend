import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Image } from '../../store/models';
import { useWindowDimensions } from '../../utils/hooks';
import Icon from '../Icon';
import { Button } from '../inputs';
import NoPrint from '../NoPrint';
import Watermark from './Watermark';
import { WrapperSize } from './Wrapper';

const Container = styled.div`
  margin-bottom: -40px;
  position: relative;
  display: flex;
  justify-content: space-between;

  .hero {
    &__main-column {
      flex: 1;

      .heading-container {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: ${p => p.theme.spacing.lg};
        margin-bottom: ${p => p.theme.spacing.lg};

        h1 {
          display: inline-block;
          line-height: 77px;
        }
      }

      .action-buttons {
        display: flex;
        flex-wrap: wrap;
        > button {
          :not(:last-child) {
            margin-right: ${p => p.theme.spacing.md};
          }
        }
      }

      .lead-text {
        margin-bottom: ${p => p.theme.spacing.lg};
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
  }

  @media ${p => p.theme.breakpoint.tablet} {
    .hero {
      &__main-column {
        .heading-container {
          flex-direction: column;
          align-items: flex-start;
        }
        .action-buttons {
          margin-top: ${p => p.theme.spacing.lg};
        }
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
  wrapperSize?: WrapperSize;
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
  wrapperSize,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isMobile, width } = useWindowDimensions();

  const showWatermarkThreshold = wrapperSize === 'sm' ? 1400 : 1600;

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
      {width > showWatermarkThreshold && (
        <Watermark isNegative left={-220} top={-20} />
      )}

      <div className={`hero__main-column align-${align}`}>
        {(showGoBack || goBackText || onGoBackClick) && (
          <NoPrint>{goBackButton}</NoPrint>
        )}

        <div className="heading-container">
          <h1>{title}</h1>
          {!!actionButtons?.length && (
            <NoPrint>
              <div className="action-buttons">{actionButtons}</div>
            </NoPrint>
          )}
        </div>

        {isMobile && smallImage && <NoPrint>{imageEl}</NoPrint>}
        <div className="lead-text">{lead}</div>
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
