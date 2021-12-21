import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-block;
  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.md};
  background-color: ${p => p.theme.color.grey3};
  border-radius: ${p => p.theme.borderRadius.sm};

  font-family: ${p => p.theme.font.secondary};
  ${p => p.theme.font.size.md};
`;

const NoCompletedTests: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Container>{t('view.well_being_profile.no_tests_completed')}</Container>
    </div>
  );
};

export default NoCompletedTests;
