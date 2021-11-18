import React from 'react';
import styled from 'styled-components';
import Stars from '../Stars';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: ${p => p.theme.spacing.md};
  text-align: center;
  height: 100%;

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
}

const TestsSummaryTotal: React.FC<Props> = ({ stars, text, details }) => (
  <Container>
    {text && <h1>{text}</h1>}
    {details && <div className="tests-summary-total__details">{details}</div>}
    {stars && <Stars stars={stars} starWidth={60} />}
    {stars && (
      <div className="tests-summary-total__details">{`${stars ?? 0} / 5`}</div>
    )}
  </Container>
);

export default TestsSummaryTotal;
