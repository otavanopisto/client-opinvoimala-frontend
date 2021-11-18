import React from 'react';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { TestsSummary as TestsSummaryType } from '../../store/models';
import TestsSummaryCategories from './TestsSummaryCategories';
import TestsSummaryCompleted from './TestsSummaryCompleted';
import TestsSummaryTotal from './TestsSummaryTotal';

const SummaryBlock = styled.div<{ highlighted?: boolean }>`
  width: 100%;
  height: 100%;
  padding: ${p => p.theme.spacing.lg};
  border-radius: ${p => p.theme.borderRadius.lg};
  ${p => p.theme.shadows[0]};
  margin-bottom: ${p => p.theme.spacing.lg};

  ${p => {
    if (p.highlighted)
      return `
        background-color: ${p.theme.color.accentLight};
        border: 1px solid ${p.theme.color.accentDark};
      `;
  }}
`;

const TestsSummary: React.FC<TestsSummaryType> = ({
  stars,
  summaryText,
  detailsText,
  completedTests,
  categories,
}) => {
  return (
    <Grid stretched stackable>
      <Grid.Column width={8}>
        <SummaryBlock>
          <TestsSummaryCategories categories={categories} />
        </SummaryBlock>
      </Grid.Column>

      <Grid.Column width={8}>
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
      </Grid.Column>
    </Grid>
  );
};

export default TestsSummary;
