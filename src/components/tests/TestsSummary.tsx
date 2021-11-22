import React from 'react';
import styled from 'styled-components';
import { TestsSummary as TestsSummaryType } from '../../store/models';
import TestsSummaryCategories from './TestsSummaryCategories';
import TestsSummaryCompleted from './TestsSummaryCompleted';
import TestsSummaryTotal from './TestsSummaryTotal';

const Container = styled.div`
  display: flex;

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;

    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.lg};
    }

    > div {
      :not(:last-child) {
        margin-bottom: ${p => p.theme.spacing.lg};
      }
    }
  }

  @media ${p => p.theme.breakpoint.tablet} {
    flex-direction: column;
    > div {
      :not(:last-child) {
        margin-right: 0;
        margin-bottom: ${p => p.theme.spacing.xl};
      }

      > div {
        :not(:last-child) {
          margin-bottom: ${p => p.theme.spacing.xl};
        }
      }
    }
  }
`;

const SummaryBlock = styled.div<{ highlighted?: boolean }>`
  width: 100%;
  height: 100%;
  padding: ${p => p.theme.spacing.lg};
  border-radius: ${p => p.theme.borderRadius.lg};
  ${p => p.theme.shadows[0]};

  ${p => {
    if (p.highlighted)
      return `
        background-color: ${p.theme.color.accentLight};
        border: 1px solid ${p.theme.color.accentDark};
      `;
  }}

  @media print {
    border: 1px solid ${p => p.theme.color.grey3};
    box-shadow: none;

    break-inside: avoid;
    page-break-inside: avoid;
    page-break-before: avoid;
  }
`;

const TestsSummary: React.FC<TestsSummaryType> = ({
  stars,
  summaryText,
  detailsText,
  completedTests,
  categories,
}) => {
  return (
    <Container>
      <div>
        <SummaryBlock>
          <TestsSummaryCategories categories={categories} />
        </SummaryBlock>
      </div>

      <div>
        <SummaryBlock highlighted>
          <TestsSummaryTotal
            stars={stars}
            text={summaryText}
            details={detailsText}
            completedTests={completedTests}
          />
        </SummaryBlock>

        <SummaryBlock>
          <TestsSummaryCompleted categories={categories} />
        </SummaryBlock>
      </div>
    </Container>
  );
};

export default TestsSummary;
