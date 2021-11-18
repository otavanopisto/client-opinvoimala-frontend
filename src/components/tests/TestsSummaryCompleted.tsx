import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TestsSummaryCategory } from '../../store/models';

const Container = styled.div`
  h1 {
    ${p => p.theme.font.h3};
  }

  ul {
    list-style-type: none;
    padding: 0;

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
  height: 8px;
  width: 100%;

  .progress-bar {
    display: ${p => (p.progress ? 'block' : 'none')};
    height: 6px;
    width: ${p => p.progress}%;
    background-color: ${p => p.theme.color.progress};
    border-radius: ${p => p.theme.borderRadius.sm};
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
      <h1>{t('view.well_being_profile.completed_tests')}</h1>
      <ul>
        {categories?.map(({ label, completedTests, totalTests }) => (
          <li>
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
