import React from 'react';
import styled from 'styled-components';
import { TestOutcome as TestOutcomeType } from '../../store/models';
import InnerHtmlDiv from '../InnerHtmlDiv';
import Image from '../Image';

const Container = styled.div`
  margin: ${p => p.theme.spacing.xl} 0;
  h2 {
    ${p => p.theme.font.h3};
  }
  img {
    margin: ${p => p.theme.spacing.xl} 0;
  }
`;

const StyledInnerHtmlDiv = styled(InnerHtmlDiv)`
  h1 {
    ${p => p.theme.font.h3};
  }
  h2 {
    ${p => p.theme.font.h4};
  }
  h3 {
    ${p => p.theme.font.h5};
  }
  h4 {
    ${p => p.theme.font.h6};
  }
`;

const TestOutcome: React.FC<TestOutcomeType> = ({ title, content, image }) => (
  <Container>
    {title && <h2>{title}</h2>}

    {content && <StyledInnerHtmlDiv html={content} />}

    {image?.url && (
      <Image apiSrc={image.url} alt={image.alternativeText ?? ''} />
    )}
  </Container>
);

export default TestOutcome;
