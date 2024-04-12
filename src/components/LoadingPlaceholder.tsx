import React from 'react';
import { Placeholder } from 'semantic-ui-react';
import { COLORS } from '../theme';

const Hero = () => {
  const customStyle = { backgroundColor: COLORS.primaryLight };
  return (
    <Placeholder fluid style={customStyle}>
      <Placeholder.Header>
        {[...Array(4)].map((_, i) => (
          <Placeholder.Line key={i} style={customStyle} />
        ))}
      </Placeholder.Header>
    </Placeholder>
  );
};

const Search = () => {
  const customStyle = { backgroundColor: COLORS.background };
  return (
    <Placeholder fluid style={customStyle}>
      {[...Array(5)].map((_, i) => (
        <Placeholder.Line key={i} style={customStyle} />
      ))}
    </Placeholder>
  );
};

const Content = () => (
  <Placeholder fluid>
    <Placeholder.Header>
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder.Header>
    <Placeholder.Paragraph>
      {[...Array(6)].map((_, i) => (
        <Placeholder.Line key={i} />
      ))}
    </Placeholder.Paragraph>
    <Placeholder.Header>
      <Placeholder.Line />
    </Placeholder.Header>
    <Placeholder.Paragraph>
      {[...Array(6)].map((_, i) => (
        <Placeholder.Line key={i} />
      ))}
    </Placeholder.Paragraph>
  </Placeholder>
);

const LoadingPlaceholder = {
  Hero,
  Search,
  Content,
};

export default LoadingPlaceholder;
