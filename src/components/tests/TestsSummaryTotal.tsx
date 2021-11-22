import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Stars from '../Stars';
import NoCompletedTests from './NoCompletedTests';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;

  > div {
    :not(:last-child) {
      margin-bottom: ${p => p.theme.spacing.md};
    }
  }

  h1 {
    ${p => p.theme.font.h2};
    margin-bottom: 0;
  }

  .tests-summary-total__details {
    font-family: ${p => p.theme.font.secondary};
    ${p => p.theme.font.size.sm};
  }
`;

interface Props {
  stars?: number | null;
  text?: string | null;
  details?: string | null;
  completedTests?: number | null;
}

const TestsSummaryTotal: React.FC<Props> = ({
  stars,
  text,
  details,
  completedTests,
}) => {
  const { t } = useTranslation();

  const defaultText = t('view.well_being_profile.welcome');
  const instructionsText = t('view.well_being_profile.instructions');
  const starsText = `${stars ?? 0} / 5`;

  return (
    <Container>
      <div>
        <h1>{text?.length ? text : defaultText}</h1>
      </div>

      <div className="tests-summary-total__details">
        {details?.length ? details : instructionsText}
      </div>

      <div>
        {!!completedTests ? (
          <Stars stars={stars ?? 0} starWidth={60} />
        ) : (
          <NoCompletedTests />
        )}
      </div>

      {stars !== null && stars !== undefined && (
        <div className="tests-summary-total__details">{starsText}</div>
      )}
    </Container>
  );
};

export default TestsSummaryTotal;
