import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TestsSummaryCategory } from '../../store/models';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    ${p => p.theme.font.h4};
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: ${p => p.theme.spacing.lg};
    }
  }
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.size.sm};
  font-family: ${p => p.theme.font.secondary};
`;

const ProgressBar = styled.div<{ progress: number }>`
  background-color: ${p => p.theme.color.grey3};
  border: 1px solid ${p => p.theme.color.secondary};
  border-radius: ${p => p.theme.borderRadius.sm};
  height: 10px;
  width: 100%;

  .progress-bar {
    display: ${p => (p.progress ? 'block' : 'none')};
    height: 8px;
    width: ${p => p.progress}%;
    background-color: ${p => p.theme.color.progress};

    /* Show progress bar's background color for prints as well: */
    -webkit-print-color-adjust: exact !important; /* Chrome, Safari, Edge */
    color-adjust: exact !important; /*Firefox*/

    border-top-left-radius: ${p => p.theme.borderRadius.sm};
    border-bottom-left-radius: ${p => p.theme.borderRadius.sm};
    border-top-right-radius: ${p =>
      p.progress === 100 && p.theme.borderRadius.sm};
    border-bottom-right-radius: ${p =>
      p.progress === 100 && p.theme.borderRadius.sm};

    border-right-style: solid;
    border-right-color: ${p => p.theme.color.secondary};
    border-right-width: ${p => (p.progress < 100 ? 1 : 0)}px;
  }
`;

interface Props {
  categories?: TestsSummaryCategory[] | null;
}

const TestsSummaryCompleted: React.FC<Props> = ({ categories }) => {
  const { t } = useTranslation();

  const getProgressPercent = (count?: number | null, total?: number | null) => {
    const progress = (count ?? 0) / (total ?? 1);
    return progress ? progress * 100 : 0;
  };

  return (
    <Container>
      <h2>{t('view.well_being_profile.completed_tests')}</h2>
      <ul>
        {categories?.map(({ id, label, completedTests, totalTests }) => (
          <li key={id}>
            <Label>
              <div>{label}</div>
              <div>{`${completedTests ?? 0}/${totalTests ?? 0}`}</div>
            </Label>
            <ProgressBar
              progress={getProgressPercent(completedTests, totalTests)}
            >
              <div className="progress-bar"></div>
            </ProgressBar>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default TestsSummaryCompleted;
