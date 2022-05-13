import React from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface Props {
  level?: HeadingLevel;
  className?: string;
}

const Heading: React.FC<Props> = ({ level, className, children }) => {
  const headingProps = { className };

  switch (level) {
    case 'h1':
      return <h1 {...headingProps}>{children}</h1>;
    case 'h2':
      return <h2 {...headingProps}>{children}</h2>;
    case 'h3':
      return <h3 {...headingProps}>{children}</h3>;
    case 'h4':
      return <h4 {...headingProps}>{children}</h4>;
    case 'h5':
      return <h5 {...headingProps}>{children}</h5>;
    case 'h6':
      return <h6 {...headingProps}>{children}</h6>;
    default:
      return <h1 {...headingProps}>{children}</h1>;
  }
};

export default Heading;
