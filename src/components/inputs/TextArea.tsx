import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledTextArea = styled.textarea`
  width: 100%;
  border: none;
  border-radius: ${p => p.theme.borderRadius.md};
  background-color: ${p => p.theme.color.grey3};
  padding: ${p => p.theme.spacing.lg};
  line-height: 150%;
`;

interface Props {
  text: string;
  onChange: (text: string) => void;
  rows?: number;
  autoFocus?: boolean;
}

export const TextArea: React.FC<Props> = ({
  text,
  onChange,
  rows = 6,
  autoFocus = false,
}) => {
  const [value, setValue] = useState<string>(text);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value);
  };

  /**
   * Set the actual text value after a short delay
   * instead of setting it right after each change,
   * which would cause some lagging during typing.
   */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (text !== value) onChange(value);
    }, 250);

    return () => clearTimeout(delay);
  }, [onChange, text, value]);

  return (
    <StyledTextArea
      value={value}
      onChange={handleTextChange}
      rows={rows}
      autoFocus={autoFocus}
    />
  );
};

export default TextArea;