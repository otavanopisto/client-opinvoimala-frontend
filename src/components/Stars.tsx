import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StarSvg from '../assets/icons/star.svg';

const MOBILE_STAR_SIZE = 0.75;

const Container = styled.section`
  display: flex;

  > div {
    &:not(:last-child) {
      margin-right: ${p => p.theme.spacing.sm};
    }
  }
`;

const Star = styled.div<{ fullStarWidth: number; width: number }>`
  height: ${p => p.fullStarWidth}px;
  background-size: ${p => p.fullStarWidth * MOBILE_STAR_SIZE}px;
  background-image: url(${StarSvg});
  background-position: left;
  background-repeat: no-repeat;

  /* Show stars for prints as well: */
  -webkit-print-color-adjust: exact !important; /* Chrome, Safari, Edge */
  color-adjust: exact !important; /*Firefox*/
  width: ${p => p.width * MOBILE_STAR_SIZE}px;

  @media ${p => p.theme.breakpoint.mobile} {
    width: ${p => p.width}px;
    background-size: ${p => p.fullStarWidth}px;
  }
`;

interface Props {
  stars?: number | null;
  starWidth?: number;
}

const Stars: React.FC<Props> = ({ stars, starWidth = 40 }) => {
  const { t } = useTranslation();

  if (stars === null || stars === undefined) return null;

  const fullStars = Math.floor(stars);
  const lastStarWidth = (stars - fullStars) * starWidth;

  const starObjects = Array.from(Array(fullStars).keys()).map(star => ({
    id: star,
    width: starWidth,
  }));

  if (lastStarWidth) {
    starObjects.push({ id: starObjects.length, width: lastStarWidth });
  }

  if (!starObjects.length) {
    starObjects.push({ id: -1, width: 0 });
  }

  return (
    <Container aria-label={t('aria.stars', { stars })}>
      {starObjects.map(({ id, width }) => (
        <Star key={id} fullStarWidth={starWidth} width={width} />
      ))}
    </Container>
  );
};

export default Stars;
