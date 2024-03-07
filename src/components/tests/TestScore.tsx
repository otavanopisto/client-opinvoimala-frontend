import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Stars from '../Stars';

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap-reverse;

  > div {
    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.md};
    }
  }

  @media ${p => p.theme.breakpoint.mobile} {
    > div {
      :not(:last-child) {
        margin-right: ${p => p.theme.spacing.lg};
      }
    }
  }
`;

const TestPoints = styled.div`
  display: inline-block;
  padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};
  border-radius: ${p => p.theme.borderRadius.md};
  background-color: ${p => p.theme.color.primary};
  ${p => p.theme.shadows[0]};

  color: ${p => p.theme.color.background};
  font-family: ${p => p.theme.font.secondary};
  font-weight: bold;
  ${p => p.theme.font.size.xs};
`;

interface Props {
  points?: number | null;
  maxPoints?: number | null;
  stars?: number | null;
}

const TestScore: React.FC<Props> = ({ points, maxPoints, stars }) => {
  const { t } = useTranslation();

  const getPointsText = (points?: number | null, maxPoints?: number | null) => {
    if (points === undefined || points === null) return;
    const text = `${t('view.test_outcome.points')} ${points}`;
    return maxPoints ? `${text}/${maxPoints}` : text;
  };

  const pointsText = getPointsText(points, maxPoints);

  return (
    <Container>
      {pointsText && <TestPoints>{pointsText}</TestPoints>}
      {stars && <Stars stars={stars} />}
    </Container>
  );
};

export default TestScore;
