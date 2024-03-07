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

const Container = styled.div`
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
      }
      .lead-text {
        margin-bottom: ${p => p.theme.spacing.lg};
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
        flex-basis: 50%;
        .heading-container {
          margin-top: ${p => p.theme.spacing.lg};
          margin-bottom: ${p => p.theme.spacing.lg};
          h1 {
              line-height: 43px;
          }
        }
        &.align-center {
          text-align: left;
        }
      }
      
      &__side-column {
        flex-basis: 50%;
      }
  }

  @media ${p => p.theme.breakpoint.tablet} {
    .hero {
      &__main-column {
        flex-basis: 65%;
        flex-grow: 1;
        .heading-container {
          flex-direction: row;
          align-items: center;
          margin-top: ${p => p.theme.spacing.lg};
          margin-bottom: ${p => p.theme.spacing.lg};

          h1 {
            line-height: 77px;
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
  const { isMobile } = useWindowDimensions();

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

  const imageEl = !image?.url ? undefined : (
    <Image apiSrc={image?.url} alt="" width={smallImage ? '150px' : '300px'} />
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
        </>
      )}
    </Container>
  );
};

export default Hero;
