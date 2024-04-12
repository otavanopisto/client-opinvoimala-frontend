import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Image as ImageType } from '../../store/models';
import { useWindowDimensions } from '../../utils/hooks';
import Icon from '../Icon';
import { Button } from '../inputs';
import NoPrint from '../NoPrint';
import Watermark from './Watermark';
import { WrapperSize } from './Wrapper';
import Image from '../Image';

const Container = styled.div<{ marginSize?: string }>`
  margin-bottom: -40px;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  .hero {
    &__main-column {
      &.align-center {
        text-align: center;
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
      .heading-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: ${p => p.theme.spacing.lg};
        margin-bottom: ${p => p.theme.spacing.lg};

  
        h1 {
          word-wrap: normal;
        }
      } 
    }
    &__back-button-label,
    &__download-button-label {
      display: flex;
      align-items: center;

      svg {
        margin-left: -10px;
        margin-right: 5px;
      }
    }
  }
  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: row;

    .hero {
      &__main-column {
        .decription-container { 
          display: flex;
        
        }
        .heading-container {
          margin-top: ${p => p.theme.spacing.lg};
          margin-bottom: ${p => p.theme.spacing.lg};
        }
        
        &.align-center {
          text-align: left;
        }
        .lead-text { 
          margin-left: 20px;
        }
        .description-container {
          display: flex;
          flex-basis: 100%;
        }
      }
  }

  @media ${p => p.theme.breakpoint.tablet} {
    .hero {
      &__main-column {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        .heading-container {

          flex-direction: row;
          align-items: center;
          margin-top: ${p => p.theme.spacing.lg};
          margin-bottom: ${p => p.theme.spacing.lg};

          h1 {
            line-height: 77px;
            margin-right: ${p => (p.marginSize ? p.marginSize : undefined)};
          }

        }
        
        .heading-container {
          img {
            position: absolute;
            right: 0;
            top: 0;
          }

        }

        .description-container  {
          position: relative;

          .lead-text { 
            margin-right: ${p => (p.marginSize ? p.marginSize : undefined)};
          }
        }
      }
    }
  }
`;

export interface HeroProps {
  title?: string | null | JSX.Element;
  lead?: string | JSX.Element | null;
  image?: ImageType | null;
  smallImage?: boolean;
  align?: string;
  goBackText?: string;
  showGoBack?: boolean;
  onGoBackClick?: () => void;
  showDownload?: boolean;
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
  showDownload,
  actions,
  wrapperSize,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isTablet, isMobile } = useWindowDimensions();

  const handleGoBack = () => {
    if (onGoBackClick) {
      onGoBackClick();
    } else {
      history.goBack();
    }
  };

  const handleDownload = () => {
    window.print();
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

  const downloadButton = (
    <Button
      id="hero__download-button"
      onClick={handleDownload}
      isSmall
      text={
        <div className="hero__download-button-label">
          <Icon type="Download" />
          {t('action.download')}
        </div>
      }
    />
  );

  const imageSize = smallImage ? 150 : 300;
  const imageEl = !image?.url ? undefined : (
    <Image apiSrc={image?.url} alt="" width={imageSize} />
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
    <Container marginSize={imageEl && (20 + imageSize).toString() + 'px'}>
      <Watermark
        isNegative
        left={-220}
        top={-20}
        showOnlyOnScreensAbove={wrapperSize === 'sm' ? 1400 : 1600}
      />
      <div className={`hero__main-column align-${align}`}>
        <NoPrint>
          <div className="action-buttons">
            {(showGoBack || goBackText || onGoBackClick) && goBackButton}
            {showDownload && downloadButton}
          </div>
        </NoPrint>
        <div className="heading-container">
          {isMobile && imageEl && <NoPrint>{imageEl}</NoPrint>}
          <h1>{title}</h1>
          {!!actionButtons?.length && (
            <NoPrint>
              <div className="action-buttons">{actionButtons}</div>
            </NoPrint>
          )}
          {!isTablet && imageEl && <NoPrint>{imageEl}</NoPrint>}
        </div>
        <div className="description-container">
          {isTablet && !isMobile && imageEl && <NoPrint>{imageEl}</NoPrint>}
          <div className="lead-text">{lead}</div>
        </div>
      </div>
    </Container>
  );
};

export default Hero;
