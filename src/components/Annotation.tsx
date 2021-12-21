import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Icon from './Icon';

const Container = styled.div`
  display: flex;
  border: 1px solid ${p => p.theme.color.secondary};
  border-radius: ${p => p.theme.borderRadius.sm};
  padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.size.sm};

  svg {
    margin-right: ${p => p.theme.spacing.lg};
  }

  @media ${p => p.theme.breakpoint.mobile} {
    svg {
      width: 50px;
      margin-right: ${p => p.theme.spacing.md};
    }
  }
`;

interface Props {
  text: string;
}

const Annotation: React.FC<Props> = ({ text }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Icon type="Annotation" width={28} />
      <div>
        <strong>{t('annotation.nb')} </strong>
        {text}
      </div>
    </Container>
  );
};

export default Annotation;
