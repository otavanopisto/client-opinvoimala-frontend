import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Icon from './Icon';

const Container = styled.div`
  display: flex;
  border: 1px solid ${p => p.theme.color.secondary};
  border-radius: ${p => p.theme.borderRadius.sm};
  padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};
  margin: ${p => p.theme.spacing.lg} 0;
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.size.sm};

  svg {
    width: 50px;
    margin-right: ${p => p.theme.spacing.md};
  }

  @media ${p => p.theme.breakpoint.mobile} {
    svg {
      width: auto;
      margin-right: ${p => p.theme.spacing.lg};
    }
  }
`;

const SimpleContainer = styled.div`
  margin: ${p => p.theme.spacing.lg} 0;
  ${p => p.theme.font.size.sm};
`;

interface Props {
  text: string | JSX.Element;
  prefix?: string | JSX.Element;
  simple?: boolean;
}

const Annotation: React.FC<Props> = ({ text, prefix, simple }) => {
  const { t } = useTranslation();

  if (simple) {
    return (
      <SimpleContainer>
        {prefix && prefix}
        {text}
      </SimpleContainer>
    );
  }

  return (
    <Container>
      <Icon type="Annotation" width={28} />
      <div>
        <strong>{t('annotation.nb')} </strong>
        {prefix && prefix}
        {text}
      </div>
    </Container>
  );
};

export default Annotation;
