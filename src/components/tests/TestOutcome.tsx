import React from 'react';
import styled from 'styled-components';
import { TestOutcome as TestOutcomeType } from '../../store/models';
import InnerHtmlDiv from '../InnerHtmlDiv';

const Container = styled.div`
  margin: ${p => p.theme.spacing.xl} 0;
  h1 {
    ${p => p.theme.font.h2};
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
    {title && <h1>{title}</h1>}

    {content && <StyledInnerHtmlDiv html={content} />}

    {image?.url && <img src={image.url} alt={image.alternativeText ?? ''} />}
  </Container>
);

export default TestOutcome;
